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

// ── method 2: fget.io — intercept real download URL ──
async function browserDownload(fbUrl) {
  let browser = null
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote']
    })

    const context = await browser.newContext()
    const page    = await context.newPage()

    // popup killer
    context.on('page', async p => await p.close().catch(() => {}))

    // block heavy resources
    await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff,woff2,svg,ico}', r => r.abort())

    // intercept the real mp4 download URL from network
    let capturedUrl = null
    page.on('request', req => {
      const url = req.url()
      if (url.includes('.mp4') || url.includes('video')) {
        capturedUrl = url
      }
    })
    page.on('response', async res => {
      const url = res.url()
      const ct  = res.headers()['content-type'] || ''
      if (ct.includes('video') || url.includes('.mp4')) {
        capturedUrl = url
      }
    })

    await page.goto('https://fget.io/', { waitUntil: 'domcontentloaded', timeout: 30000 })

    // paste fb url — exactly like original
    await page.waitForSelector('#main-link', { timeout: 15000 })
    await page.evaluate((url) => {
      const input = document.querySelector('#main-link')
      input.value = url
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }, fbUrl)

    // click download button — exactly like original
    await page.click('#main_submit')

    // wait 3s for links — exactly like original
    await new Promise(r => setTimeout(r, 3000))

    // wait for SD button
    await page.waitForSelector('a.download-result.sd', { timeout: 15000 })

    // get href directly from element
    const dlUrl = await page.$eval('a.download-result.sd', el => el.href)
    if (!dlUrl && !capturedUrl) throw new Error('No download URL found')

    const finalUrl = dlUrl || capturedUrl

    // download via axios
    const file   = path.join(TEMP, `fb_${Date.now()}.mp4`)
    const writer = fs.createWriteStream(file)
    const stream = await axios({
      url: finalUrl, method: 'GET', responseType: 'stream', timeout: 120000,
      headers: {
        'Referer':    'https://fget.io/',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36'
      }
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
    if (!url) return reply('🎬 Facebook video URL !\nExample: *.fb https://www.facebook.com/...*')

    let file

    // try fast method first
    try {
      file = await fastDownload(url)
    } catch {
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
