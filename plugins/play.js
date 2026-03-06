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
const yts   = require('yt-search')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

async function searchVideo(query) {
  try {
    const { videos } = await yts.search(query)
    return videos?.[0] || null
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
    await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff,woff2,svg,ico}', r => r.abort())
    await page.goto('https://media.ytmp3.gg/', { waitUntil: 'domcontentloaded', timeout: 60000 })

    const input = 'input[placeholder*="URL"], #videoUrl, .form-control'
    await page.waitForSelector(input, { timeout: 15000 })
    await page.fill(input, videoUrl)
    await page.keyboard.press('Enter')
    await page.waitForSelector('#download-btn', { state: 'visible', timeout: 90000 })

    const url = await page.$eval('#download-btn', el =>
      el.getAttribute('href') || el.getAttribute('data-url')
    )
    if (!url) throw new Error('No download link found')

    const file = path.join(TEMP, `${Date.now()}.m4a`)
    const writer = fs.createWriteStream(file)
    const stream = await axios({
      url, method: 'GET', responseType: 'stream', timeout: 60000,
      headers: { Referer: 'https://media.ytmp3.gg/' }
    })
    stream.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(file))
      writer.on('error',  reject)
    })

  } finally {
    if (browser) await browser.close().catch(() => {})
  }
}

commands.push({
  pattern: 'play',
  alias:   ['ytplay'],
  react:   '🎶',
  function: async (conn, mek, ctx) => {
    const { from, q, reply } = ctx
    if (!q) return reply('🎶 Song name !\nExample: *.play shape of you*')

    const video = await searchVideo(q)
    if (!video) return reply('❌ Results.')

    await reply(`_Downloading..._\n*${video.title}*`)

    let file
    try {
      file = await downloadAudio(video.url)
    } catch (e) {
      return reply(`❌ Download failed: ${e.message}`)
    }

    // empty file check
    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      return reply('❌ Downloaded file is empty.')
    }

    await conn.sendMessage(from, {
      document: { url: file },
      mimetype: 'audio/mp4',
      fileName: `${video.title}.m4a`,
    }, { quoted: mek })

    if (fs.existsSync(file)) fs.unlinkSync(file)
  }
})
