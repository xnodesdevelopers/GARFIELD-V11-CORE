/**
 * ◈ GARFIELD-V11-CORE ◈
 * * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 */
const { commands } = require('../command')
const { pipeline } = require('stream/promises')
const fs   = require('fs')
const path = require('path')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

commands.push({
  pattern: 'app',
  alias:   ['apk'],
  react:   '📲',
  function: async (conn, mek, ctx) => {
    const { from, q, reply } = ctx
    if (!q) return reply('📲 App name !\nExample: *.app instagram*')

    await reply('🔍 Searching...')

    let app
    try {
      const res  = await fetch(`https://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}`)
      const data = await res.json()
      app = data?.datalist?.list?.[0]
      if (!app) return reply('❌ App.')
    } catch {
      return reply('❌ Store connection failed.')
    }

    const file = path.join(TEMP, `${app.uname}_${Date.now()}.apk`)
    try {
      const res = await fetch(app.file.path)
      if (!res.ok) throw new Error('Download failed')
      await pipeline(res.body, fs.createWriteStream(file))
    } catch (e) {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      return reply(`❌ Download failed: ${e.message}`)
    }

    if (!fs.existsSync(file) || fs.statSync(file).size === 0) {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      return reply('❌ Downloaded file is empty.')
    }

    const size      = (app.file.filesize / 1e6).toFixed(2)
    const rating    = app.stats.rating.avg > 0 ? app.stats.rating.avg.toFixed(1) : '4.5'
    const downloads = app.stats.downloads > 1000000
      ? (app.stats.downloads / 1000000).toFixed(1) + 'M+'
      : app.stats.downloads.toLocaleString() + '+'

    const caption =
      `*${app.name}* ✅\n_${app.developer.name}_\n\n` +
      `\`\`\`${rating} ⭐  |  ${downloads} 📥\`\`\`\n` +
      `────────────────────\n` +
      `\`\`\`📂 Size    : ${size} MB\`\`\`\n` +
      `\`\`\`⚙️ Version : ${app.file.vername}\`\`\`\n` +
      `\`\`\`🛡️ Package : ${app.package}\`\`\`\n\n` +
      `> _Xnodes Development © 2026_`

    await conn.sendMessage(from, {
      document: { url: file },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${app.name}.apk`,
      caption,
    }, { quoted: mek })

    if (fs.existsSync(file)) fs.unlinkSync(file)
  }
})
