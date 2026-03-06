const { commands } = require('../command')

const LOGO = 'https://github.com/Zenoixnoize/GARFIELD-WHATSAPP-BOT-v8/raw/asdf/Cloud/logo.png'

const ownerInfo =
  `🐺 *Ｇ Ａ Ｒ Ｆ Ｉ Ｅ Ｌ Ｄ  ·  O W N E R* 🐺\n\n` +
  `👤 *Name:* Tharindu Liyanage (sanku)\n` +
  `🎓 *Education:* UOR | Faculty of Applied Science\n` +
  `🎂 *Age:* 20\n` +
  `🌙 *Personality:* Introvert 🐺\n` +
  `💻 *Role:* Student | Programmer\n\n` +
  `🔗 *Social Links:*\n` +
  `🌐 fb.com/Sankuliyan\n` +
  `📸 instagram.com/liyanage_tharindu_\n` +
  `🐙 github.com/xnodesdevelopers\n` +
  `📦 github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10\n\n` +
  `> © Ｘｎｏｄｅｓ 2026`

commands.push({
  pattern: 'owner',
  react:   '🐺',
  function: async (conn, mek, ctx) => {
    const { from } = ctx
    try {
      await conn.sendMessage(from, {
        image:   { url: LOGO },
        caption: ownerInfo,
      }, { quoted: mek })
    } catch {
      await ctx.reply(ownerInfo)
    }
  }
})