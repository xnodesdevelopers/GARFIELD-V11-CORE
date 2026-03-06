const { commands } = require('../command')
const config = require('../config')
const fs   = require('fs')
const path = require('path')

const VIDEO = path.join(__dirname, '../lib/menuvideo.mp4')
const videoBuffer = fs.existsSync(VIDEO) ? fs.readFileSync(VIDEO) : null

commands.push({
  pattern: 'alive',
  react:   '🐼',
  function: async (conn, mek, ctx) => {
    const { from } = ctx

    const msg =
      `*${config.BOT_NAME || 'GARFIELD'} is Online!* 🐼🔥\n\n` +
      `*Runtime:* ${(process.uptime() / 60).toFixed(2)} mins\n` +
      `*Version:* v10\n` +
      `*Status:* High Speed & Optimized ⚡\n` +
      `*Platform:* Linux (Server)\n\n` +
      `> Type *${config.PREFIX}menu* to see all commands.\n` +
      `> 📦 https://github.com/xnodesdevelopers/GARFIELD-V11-CORE\n` +
      `> © Ｘｎｏｄｅｓ 2026`

    if (videoBuffer) {
      await conn.sendMessage(from, {
        video:       videoBuffer,
        caption:     msg,
        gifPlayback: true,
      }, { quoted: mek })
    } else {
      await conn.sendMessage(from, { text: msg }, { quoted: mek })
    }
  }
})