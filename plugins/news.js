/**
 * Author: Tharindu Liyanage | Xnodes Development
 * GitHub: https://github.com/xnodesdevelopers
 */

'use strict'

const { commands } = require('../command')
const { chromium } = require('playwright')

commands.push({
  pattern: 'news',
  alias:   ['esana'],
  react:   '📰',
  function: async (conn, mek, ctx) => {
    const { from, reply } = ctx
    let browser = null
    try {
      await reply('🔍 Searching latest Sri Lanka news...')

      browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--single-process',
          '--no-zygote',
        ]
      })

      const page = await browser.newPage()
      await page.route('**/*.{png,jpg,jpeg,gif,webp,css,woff,woff2,svg,ico,mp4,mp3}', r => r.abort())

      await page.goto('https://www.helakuru.lk/esana/', { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForFunction(
        () => Array.from(document.querySelectorAll('a')).some(a => a.href.includes('/esana/news/')),
        { timeout: 20000 }
      )

      const newsLink = await page.evaluate(
        () => Array.from(document.querySelectorAll('a')).find(a => a.href.includes('/esana/news/'))?.href || null
      )
      if (!newsLink) throw new Error('No news links found')

      await page.goto(newsLink, { waitUntil: 'domcontentloaded', timeout: 60000 })
      await page.waitForSelector('h2.news_title', { timeout: 15000 })

      const { title, content } = await page.evaluate(() => ({
        title: document.querySelector('h2.news_title')?.innerText.trim() || 'No Title',
        content: Array.from(document.querySelectorAll('.news-single-content p.news_text'))
          .map(p => p.innerText.trim())
          .filter(t => t.length > 5)
          .join('\n\n')
      }))

      if (!content) throw new Error('Article content is empty')

      const text = [
        '📰 *HELAKURU ESANA*',
        '▬▬▬▬▬▬▬▬▬▬▬▬▬',
        '',
        `*${title}*`,
        '',
        content,
        '',
        '▬▬▬▬▬▬▬▬▬▬▬▬▬',
        '✅ *Verified News*',
        '📡 *Source:* Helakuru Esana',
        '💻 *Coded by:* Xnodes Development',
      ].join('\n')

      await conn.sendMessage(from, { text }, { quoted: mek })

    } catch (e) {
      await reply(`❌ Error: ${e.message}`)
    } finally {
      if (browser) await browser.close().catch(() => {})
    }
  }
})
