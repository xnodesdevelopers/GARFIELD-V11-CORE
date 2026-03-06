const { commands } = require('../command')
const { facebook } = require('another-fb-video-downloader')
const fs    = require('fs')
const path  = require('path')
const axios = require('axios')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

commands.push({
  pattern: 'fb',
  alias:   ['facebook'],
  react:   '🎬',
  function: async (conn, mek, ctx) => {
    const { from, args, reply } = ctx
    const url = args[0]
    if (!url) return reply('🎬 Facebook video URL දෙන්න!\nExample: *.fb https://www.facebook.com/...*')

    await reply('🔍 Downloading video...')

    let videoUrl
    try {
      videoUrl = await facebook(url, false)
    } catch (e) {
      return reply(`❌ URL extract failed: ${e.message}`)
    }
    if (!videoUrl) return reply('❌ Video link.')

    const file = path.join(TEMP, `fb_${Date.now()}.mp4`)
    try {
      const writer = fs.createWriteStream(file)
      const stream = await axios({ url: videoUrl, method: 'GET', responseType: 'stream', timeout: 60000 })
      stream.data.pipe(writer)
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error',  reject)
      })
    } catch (e) {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      return reply(`❌ Download failed: ${e.message}`)
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