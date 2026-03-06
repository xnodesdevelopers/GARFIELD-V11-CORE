const { commands } = require('../command')
const config = require('../config')
const fs   = require('fs')
const path = require('path')

const VIDEO = path.join(__dirname, '../lib/menuvideo.mp4')
const videoBuffer = fs.existsSync(VIDEO) ? fs.readFileSync(VIDEO) : null

commands.push({
  pattern: 'menu',
  alias:   ['help', 'start'],
  react:   '🐼',
  function: async (conn, mek, ctx) => {
    const { from, pushname } = ctx
    const start = Date.now()

    const menu = `
▬
▎ 𝖦Λ𝖱𝖥𝖨Ξ𝖫𝖣 𝖡𝖮Т v11
▎ █ 𝗛𝗲𝘆: ${pushname}
▎ █ 𝗦𝗽𝗲𝗲𝗱: ${Date.now() - start}ms
▎ █ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲: ${config.BOT_NAME || 'Garfield'}
▎ █ 𝗢𝘄𝗻𝗲𝗿: ${config.OWNER_NUMBER}
▎ █ 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺: Linux (Server)

    Ｍｅｎｕ Ｃｏｍｍａｎｄｓ 🌀
    ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁

    📥 *Ｄｏｗｎｌｏａｄｅｒｓ*
    *▓  ${config.PREFIX}song <query>* - Download MP3 🎶
    *▓  ${config.PREFIX}play <query>* - Play Music (M4A) 📂
    *▓  ${config.PREFIX}app <name>* - Download Android APK 📲
    *▓  ${config.PREFIX}fb <url>* - Facebook Video 🎬
    *▓  ${config.PREFIX}news* - Latest SL News 📰

    🛠️ *Ｔｏｏｌｓ*
    *▓  ${config.PREFIX}sticker* - Image/Video to Sticker 🎨
    *▓  ${config.PREFIX}toimage* - Sticker to Image/Video 🖼️
    *▓  ${config.PREFIX}tomp3* - Video to MP3 🎙️

    👥 *Ｇｒｏｕｐ*
    *▓  ${config.PREFIX}members* - List All Members 👥

    🐼 *Ｓｙｓｔｅｍ*
    *▓  ${config.PREFIX}alive* - Bot Status 🐼
    *▓  ${config.PREFIX}menu* - Show this Menu 📜
    *▓  ${config.PREFIX}owner* - Developer Info 🐺

    🐺 *Ｄｅｖ*
    *Programmed by Tharindu Liyanage from Xnodes*
> © Ｘｎｏｄｅｓ 𝘿𝙚𝙫𝙚𝙡𝙤𝙥𝙢𝙚𝙣𝙩 2026`.trim()

    if (videoBuffer) {
      await conn.sendMessage(from, {
        video:       videoBuffer,
        caption:     menu,
        gifPlayback: true,
      }, { quoted: mek })
    } else {
      await conn.sendMessage(from, { text: menu }, { quoted: mek })
    }
  }
})
