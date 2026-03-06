/**
 * ◈ GARFIELD-V11-CORE ◈
 * * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 */
const { commands } = require('../command')
const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const { execFile } = require('child_process')
const fs   = require('fs')
const path = require('path')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

commands.push({
  pattern: 'toimage',
  alias:    ['toimg', 'unsticker'],
  react:    '🖼️',
  function: async (conn, mek, ctx) => {
    const { from, reply, isSticker } = ctx

    const contextInfo = mek.message?.extendedTextMessage?.contextInfo
    const quotedMsg   = contextInfo?.quotedMessage

    let targetMessage = null
    if (quotedMsg && getContentType(quotedMsg) === 'stickerMessage') {
      targetMessage = quotedMsg
    } else if (isSticker) {
      targetMessage = mek.message
    }

    if (!targetMessage)
      return reply('❌ Please reply to a sticker to convert it.')

    try {
      const stream = await downloadContentFromMessage(
        targetMessage.stickerMessage, 'sticker'
      )
      const chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      const buffer     = Buffer.concat(chunks)
      const isAnimated = targetMessage.stickerMessage?.isAnimated
      const stamp      = Date.now()

      if (!isAnimated) {
        // static sticker → send as image (webp → jpeg via ffmpeg)
        const inFile  = path.join(TEMP, `${stamp}.webp`)
        const outFile = path.join(TEMP, `${stamp}.jpg`)
        fs.writeFileSync(inFile, buffer)

        await new Promise((resolve, reject) => {
          execFile('ffmpeg', ['-i', inFile, outFile], e => e ? reject(e) : resolve())
        })

        await conn.sendMessage(from, {
          image: { url: outFile },
        }, { quoted: mek })

        fs.existsSync(inFile)  && fs.unlinkSync(inFile)
        fs.existsSync(outFile) && fs.unlinkSync(outFile)

      } else {
        // animated sticker → webp → mp4 via ffmpeg
        const inFile  = path.join(TEMP, `${stamp}.webp`)
        const outFile = path.join(TEMP, `${stamp}.mp4`)
        fs.writeFileSync(inFile, buffer)

        await new Promise((resolve, reject) => {
          execFile('ffmpeg', [
            '-i', inFile,
            '-vf', 'scale=512:512:flags=lanczos',
            '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
            outFile
          ], e => e ? reject(e) : resolve())
        })

        await conn.sendMessage(from, {
          video:   { url: outFile },
          mimetype: 'video/mp4',
        }, { quoted: mek })

        fs.existsSync(inFile)  && fs.unlinkSync(inFile)
        fs.existsSync(outFile) && fs.unlinkSync(outFile)
      }

    } catch (e) {
      console.error('[TOIMAGE]', e.message)
      await reply('❌ Failed to convert sticker.')
    }
  }
})
