/**
 * ◈ GARFIELD-V11-CORE ◈
 * * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 */
const { commands } = require('../command')
const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const { Sticker, StickerTypes } = require('wa-sticker-formatter')

commands.push({
  pattern: 'sticker',
  alias:    ['s', 'stiker'],
  react:    '🎨',
  function: async (conn, mek, ctx) => {
    const { from, reply, isImage, isVideo, pushname } = ctx

    // get target — quoted or current message
    const contextInfo = mek.message?.extendedTextMessage?.contextInfo
    const quotedMsg   = contextInfo?.quotedMessage

    let targetMessage = null
    let msgType       = null

    if (quotedMsg) {
      const qType = getContentType(quotedMsg)
      if (qType === 'imageMessage' || qType === 'videoMessage') {
        targetMessage = quotedMsg
        msgType       = qType
      }
    } else if (isImage) {
      targetMessage = mek.message
      msgType       = 'imageMessage'
    } else if (isVideo) {
      targetMessage = mek.message
      msgType       = 'videoMessage'
    }

    if (!targetMessage || !msgType)
      return reply('❌ Please reply to an Image or Video, or send one with the command.')

    try {
      const stream = await downloadContentFromMessage(
        targetMessage[msgType],
        msgType.replace('Message', '')
      )
      const chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      const buffer = Buffer.concat(chunks)

      const sticker = new Sticker(buffer, {
        pack:    'Garfield Bot 🐼',
        author:  pushname || 'Xnodes',
        type:    StickerTypes.FULL,
        quality: 50,
      })

      await conn.sendMessage(from, { sticker: await sticker.toBuffer() }, { quoted: mek })

    } catch (e) {
      console.error('[STICKER]', e.message)
      await reply('❌ Failed to convert media to sticker.')
    }
  }
})
