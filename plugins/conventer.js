const { commands } = require('../command')
const { downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')
const { execFile } = require('child_process')
const fs   = require('fs')
const path = require('path')

const TEMP = path.join(__dirname, '../lib/store')
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

commands.push({
  pattern: 'tomp3',
  alias:   ['mp3', 'convert'],
  react:   '🎵',
  function: async (conn, mek, ctx) => {
    const { from, reply, isVideo, isAudio, isVoice } = ctx

    // get target — quoted or current message
    const contextInfo = mek.message?.extendedTextMessage?.contextInfo
    const quotedMsg   = contextInfo?.quotedMessage

    // pick message to convert
    let targetMessage = null
    let msgType       = null

    if (quotedMsg) {
      const qType = getContentType(quotedMsg)
      if (qType === 'videoMessage' || qType === 'audioMessage') {
        targetMessage = quotedMsg
        msgType       = qType
      }
    } else if (isVideo) {
      targetMessage = mek.message
      msgType       = 'videoMessage'
    } else if (isAudio || isVoice) {
      targetMessage = mek.message
      msgType       = 'audioMessage'
    }

    if (!targetMessage || !msgType)
      return reply('❌ Reply to a video or voice note with *.tomp3*')

    await reply('⏳ Converting to MP3...')

    const stamp   = Date.now()
    const inFile  = path.join(TEMP, `${stamp}_in`)
    const outFile = path.join(TEMP, `${stamp}.mp3`)

    try {
      const stream = await downloadContentFromMessage(
        targetMessage[msgType],
        msgType.replace('Message', '')
      )
      const chunks = []
      for await (const chunk of stream) chunks.push(chunk)
      fs.writeFileSync(inFile, Buffer.concat(chunks))

      await new Promise((resolve, reject) => {
        execFile('ffmpeg', [
          '-i', inFile,
          '-vn', '-ar', '44100', '-ac', '2', '-b:a', '192k',
          outFile,
        ], (err) => err ? reject(err) : resolve())
      })

      await conn.sendMessage(from, {
        audio:    { url: outFile },
        mimetype: 'audio/mpeg',
        fileName: 'audio.mp3',
      }, { quoted: mek })

    } catch (e) {
      console.error('[TOMP3]', e.message)
      await reply('❌ Conversion failed. Is ffmpeg installed?')
    } finally {
      if (fs.existsSync(inFile))  fs.unlinkSync(inFile)
      if (fs.existsSync(outFile)) fs.unlinkSync(outFile)
    }
  }
})