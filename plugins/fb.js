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
const { facebook } = require('another-fb-video-downloader')
const fs    = require('fs')
const path  = require('path')
const axios = require('axios')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

// ── method 1: another-fb-video-downloader (fast) ─────
async function fastDownload(fbUrl) {
  const videoUrl = await facebook(fbUrl, false)
  if (!videoUrl) throw new Error('No URL')

  const file   = path.join(TEMP, `fb_${Date.now()}.mp4`)
  const writer = fs.createWriteStream(file)
  const stream = await axios({ url: videoUrl, method: 'GET', responseType: 'stream', timeout: 60000 })
  stream.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(file))
    writer.on('error',  reject)
  })
}

// ── method 2: fget.io browser (fallback) ─────────────
async function browserDownload(fbUrl) {
  let browser = null
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
    })

    const page = await browser.newPage()
    browser.on('page', async p => await p.close().catch(() => {}))
    await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff,woff2,svg,ico}', r => r.abort())

    await page.goto('https://fget.io/', { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForSelector('#main-link', { timeout: 15000 })
    await page.evaluate((url) => {
      const input = document.querySelector('#main-link')
      input.value = url
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }, fbUrl)

    await page.click('#main_submit')
    await new Promise(r => setTimeout(r, 3000))
    await page.waitForSelector('a.download-result.sd', { timeout: 15000 })

    const dlUrl = await page.$eval('a.download-result.sd', el => el.getAttribute('href'))
    if (!dlUrl) throw new Error('No download URL')

    const file   = path.join(TEMP, `fb_${Date.now()}.mp4`)
    const writer = fs.createWriteStream(file)
    const stream = await axios({
      url: dlUrl, method: 'GET', responseType: 'stream', timeout: 120000,
      headers: { Referer: 'https://fget.io/' }
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

// ── plugin ────────────────────────────────────────────
commands.push({
  pattern: 'fb',
  alias:   ['facebook'],
  react:   '🎬',
  function: async (conn, mek, ctx) => {
    const { from, args, reply } = ctx
    const url = args[0]
    if (!url) return reply('🎬 Facebook video URL දෙන්න!\nExample: *.fb https://www.facebook.com/...*')

    let file

    // ── try fast method first ─────────────────────────
    try {
      file = await fastDownload(url)
    } catch {
      // fast method failed → notify user → try browser
      await reply('🔒 Video is privacy protected — Wait extracting via Facebook servers...')
      try {
        file = await browserDownload(url)
      } catch (e) {
        return reply(`❌ Download failed: ${e.message}`)
      }
    }

    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      return reply('❌ Downloaded file is empty.')
    }

    await conn.sendMessage(from, {
      document: { url: file },
      mimetype: 'video/mp4',
      fileName: 'FacebookVideo.mp4',
      caption:  `🎬 *GARFIELD FB DOWNLOADER*\n\n🌍 *Source:* Facebook\n_Xnodes Development © 2026_`
    }, { quoted: mek })

    if (fs.existsSync(file)) fs.unlinkSync(file)
  }
})
