/**
 * Author: Tharindu Liyanage | Xnodes Development
 * GitHub: https://github.com/xnodesdevelopers
 */

'use strict'

const { commands } = require('../command')

const BAD_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'bastard',
  'whore', 'faggot', 'nigger', 'cunt',
]

const regex = new RegExp('\\b(' + BAD_WORDS.join('|') + ')\\b', 'i')

commands.push({
  on: 'text',
  function: async (conn, mek, ctx) => {
    const { from, body, isGroup, isSelf, isOwner, botNumber } = ctx

    if (!isGroup)          return
    if (isSelf || isOwner) return
    if (!regex.test(body)) return

    try {
      const meta      = await conn.groupMetadata(from)
      const botJid    = botNumber + '@s.whatsapp.net'
      const botMember = meta.participants.find(p => p.id === botJid)
      if (!botMember?.admin) return

      await conn.sendMessage(from, { delete: mek.key })
    } catch (e) {
      console.error('[ANTIBAD]', e.message)
    }
  }
})
