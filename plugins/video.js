/**
 * ◈ GARFIELD-V11-CORE ◈
 * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 */

'use strict'

const { commands } = require('../command')
const { chromium } = require('playwright')
const fs   = require('fs')
const path = require('path')
const axios = require('axios')
const yts  = require('yt-search')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

async function searchVideo(query) {
  try {
    const { videos } = await yts.search(query)
    return videos?.[0] || null
  } catch { return null }
}

async function downloadVideo(videoUrl) {
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

    // block popups — close any new tab instantly
    browser.on('page', async newPage => {
      await newPage.close().catch(() => {})
    })

    // block heavy resources
    await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff,woff2,svg,ico,mp3}', r => r.abort())

    await page.goto('https://en.ssyoutube.com/', { waitUntil: 'domcontentloaded', timeout: 30000 })

    // inject URL and submit
    await page.waitForSelector('#id_url', { timeout: 15000 })
    await page.evaluate((url) => {
      const input = document.querySelector('#id_url')
      input.value = url
      input.dispatchEvent(new Event('input', { bubbles: true }))
      document.querySelector('button[type="submit"]')?.click()
    }, videoUrl)

    // wait for download button
    const btnSelector = 'a[id*="download-mp4-360-audio"], a.btn-download'
    await page.waitForSelector(btnSelector, { timeout: 20000 })

    const dlUrl = await page.$eval(btnSelector, el =>
      el.getAttribute('href') || el.getAttribute('data-url')
    )
    if (!dlUrl) throw new Error('No download link found')

    // download file
    const file   = path.join(TEMP, `${Date.now()}.mp4`)
    const writer = fs.createWriteStream(file)
    const stream = await axios({
      url: dlUrl, method: 'GET', responseType: 'stream', timeout: 120000,
      headers: { Referer: 'https://en.ssyoutube.com/' }
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
  pattern: 'video',
  alias:   ['vid', 'ytvideo'],
  react:   '🎬',
  function: async (conn, mek, ctx) => {
    const { from, q, reply } = ctx
    if (!q) return reply('🎬 Song name danna!\nExample: *.video shape of you*')

    const video = await searchVideo(q)
    if (!video) return reply('❌ Video results nathuwa.')

    let file
    try {
      file = await downloadVideo(video.url)
    } catch (e) {
      return reply(`❌ Download failed: ${e.message}`)
    }

    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      return reply('❌ Downloaded file is empty.')
    }

    await conn.sendMessage(from, {
      video:    { url: file },
      mimetype: 'video/mp4',
      caption:  `🎬 *${video.title}*\n⏱️ ${video.duration.timestamp}`,
    }, { quoted: mek })

    if (fs.existsSync(file)) fs.unlinkSync(file)
  }
})
