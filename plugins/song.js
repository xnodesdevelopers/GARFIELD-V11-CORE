/**
 * ◈ GARFIELD-V11-CORE ◈
 * * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 */
const { commands } = require('../command')
const { chromium } = require('playwright')
const fs    = require('fs')
const path  = require('path')
const axios = require('axios')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

async function searchYT(query) {
  try {
    const ytSearch = require('yt-search')
    const res = await ytSearch(query)
    return res.videos?.[0] || null
  } catch { return null }
}

async function downloadAudio(videoUrl) {
  let browser = null
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-zygote',
      ]
    })

    const page = await browser.newPage()

    // block images/css/fonts — faster + less RAM
    await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff,woff2,svg,ico}', r => r.abort())

    await page.goto('https://media.ytmp3.gg/', { waitUntil: 'domcontentloaded', timeout: 60000 })

    const inputSelector = 'input[placeholder*="URL"], #videoUrl, .form-control'
    await page.waitForSelector(inputSelector, { timeout: 15000 })
    await page.fill(inputSelector, videoUrl)
    await page.keyboard.press('Enter')

    await page.waitForSelector('#download-btn', { state: 'visible', timeout: 90000 })

    const downloadUrl = await page.$eval('#download-btn', el =>
      el.getAttribute('href') || el.getAttribute('data-url')
    )

    if (!downloadUrl) throw new Error('No download link found')

    // stream to file
    const file = path.join(TEMP, `${Date.now()}.mp3`)
    const writer = fs.createWriteStream(file)
    const stream = await axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 60000,
      headers: { Referer: 'https://media.ytmp3.gg/' }
    })
    stream.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(file))
      writer.on('error',  reject)
    })

  } finally {
    // always kill browser — no matter what
    if (browser) await browser.close().catch(() => {})
  }
}

commands.push({
  pattern: 'song',
  alias:   ['music', 'audio'],
  react:   '🎵',
  function: async (conn, mek, ctx) => {
    const { from, q, reply } = ctx
    if (!q) return reply('🎵 Song name !\nExample: *.song shape of you*')

    const video = await searchYT(q)
    if (!video) return reply('❌ Results ')

    await conn.sendMessage(from, {
      image:   { url: video.thumbnail },
      caption: `*🎵 ${video.title}*\n` +
               `*⏱️ Duration:* ${video.timestamp}\n` +
               `*👤 Artist:* ${video.author.name}\n\n` +
               `_Downloading..._`
    }, { quoted: mek })

    let file
    try {
      file = await downloadAudio(video.url)
    } catch (e) {
      return reply(`❌ Download failed: ${e.message}`)
    }

    await conn.sendMessage(from, {
      audio:    { url: file },
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`,
    }, { quoted: mek })

    // cleanup
    setTimeout(() => {
      if (file && fs.existsSync(file)) fs.unlinkSync(file)
    }, 5000)
  }
})
