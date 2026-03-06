/**
 * Author: Tharindu Liyanage | Xnodes Development
 * GitHub: https://github.com/xnodesdevelopers
 */

'use strict'

const { commands } = require('../command')
const config = require('../config')

// no API key → skip plugin silently
if (!config.GEMINI_API_KEY) {
  console.log('⚠️  ai.js: No GEMINI_API_KEY — plugin skipped.')
  module.exports = {}
  return
}

// package not installed → skip plugin silently
let ai
try {
  const { GoogleGenAI } = require('@google/genai')
  ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY })
} catch {
  console.log('⚠️  ai.js: @google/genai not installed — plugin skipped.')
  module.exports = {}
  return
}

commands.push({
  pattern: 'ai',
  alias:   ['ask'],
  react:   '🤖',
  function: async (conn, mek, ctx) => {
    const { from, q, reply } = ctx

    if (!q) return reply('🤖 Ask me anything!\nExample: *.ai write an essay about Sri Lanka*')

    await reply('🤖 Thinking...')

    try {
      const result = await ai.models.generateContent({
        model:    'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: q }] }],
      })

      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
      if (!text) return reply('❌ No response received.')

      await conn.sendMessage(from, { text }, { quoted: mek })

    } catch (e) {
      console.error('[AI]', e.message)
      if (e.message?.includes('API_KEY') || e.message?.includes('403'))
        return reply('❌ Invalid Gemini API key.')
      if (e.message?.includes('429'))
        return reply('❌ Rate limit hit. Try again later.')
      return reply('❌ AI unavailable right now.')
    }
  }
})
