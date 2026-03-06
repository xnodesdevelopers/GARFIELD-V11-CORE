const { commands } = require('../command')

commands.push({
  pattern: 'members',
  alias:   ['mem'],
  react:   '👥',
  function: async (conn, mek, ctx) => {
    const { from, isGroup, reply } = ctx
    if (!isGroup) return reply('❌ Group only command.')

    const meta    = await conn.groupMetadata(from)
    const members = meta.participants
    const admins  = members.filter(m => m.admin).map(m => m.id)

    const list = members.map((m, i) => {
      const role = m.admin === 'superadmin' ? ' 👑' : m.admin ? ' ⭐' : ''
      return `${i + 1}. @${m.id.split('@')[0]}${role}`
    }).join('\n')

    await conn.sendMessage(from, {
      text:     `👥 *${meta.subject}*\nMembers: ${members.length} | Admins: ${admins.length}\n\n${list}`,
      mentions: members.map(m => m.id),
    }, { quoted: mek })
  }
})