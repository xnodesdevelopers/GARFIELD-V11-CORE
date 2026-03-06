'use strict'

const { GoogleGenAI } = require('@google/genai')
const { commands }    = require('../command')
const config          = require('../config')

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY })

const _fmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Colombo',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hour12: false,
})
const getTime = () => _fmt.format(new Date()).replace(/\//g, '-')

const SYSTEM = `WhatsApp Bot Integration: Garfield AI (Sinhala Language)
Name: Garfield
Creator: Tharindu Liyanage (සංකු)
Tone: Young, conversational Sinhala — friendly, funny, creative, emotional.
If someone is rude or provocative, clap back with sharp witty Sinhala energy. 🔥
Use meaningful emojis. Never repeat the sender's message. No labels like "user" or "Garfield" in response.`

commands.push({
  on: 'text',
  function: async (conn, mek, ctx) => {
    const { from, body, isCmd, isGroup, isSelf, pushname } = ctx

    // ignore commands
    if (isCmd)    return
    // ignore groups
    if (isGroup)  return
    // ignore bot's own messages
    if (isSelf)   return
    // ignore empty
    if (!body?.trim()) return

    try {
      const result = await ai.models.generateContent({
        model:    'gemini-2.5-flash',
        contents: [{
          role:  'user',
          parts: [{ text:
            `${SYSTEM}\n\n` +
            `Date/Time (Sri Lanka): ${getTime()}\n` +
            `Sender: ${pushname}\n` +
            `Message: ${body}\n\n` +
            `Respond naturally in Sinhala.`
          }]
        }]
      })

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!text) return

      await conn.sendMessage(from, { text }, { quoted: mek })

    } catch (e) {
      console.error('[AI]', e.message)
    }
  }
})