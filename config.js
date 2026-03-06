/**
 * ◈ GARFIELD-V11-CORE ◈
 * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 *
 * ╔══════════════════════════════════════════════════════╗
 * ║              CONFIGURATION GUIDE                    ║
 * ╠══════════════════════════════════════════════════════╣
 * ║                                                      ║
 * ║  PREFIX        → The symbol before every command    ║
 * ║                  Default: '.'  → .menu .song etc    ║
 * ║                                                      ║
 * ║  BOT_NAME      → Your bot's display name            ║
 * ║                                                      ║
 * ║  OWNER_NUMBER  → Your WhatsApp number               ║
 * ║                  No + sign. Example: 94711234567    ║
 * ║                                                      ║
 * ║  MODE          → Who can use the bot                ║
 * ║    public  → everyone can use                       ║
 * ║    private → only owner can use                     ║
 * ║    groups  → only in group chats                    ║
 * ║    inbox   → only in private/DM chats               ║
 * ║                                                      ║
 * ║  READ_MESSAGE  → Auto read messages                 ║
 * ║    'true'  → mark messages as read                  ║
 * ║    'false' → don't mark as read                     ║
 * ║                                                      ║
 * ║  GEMINI_API_KEY → Google Gemini AI key              ║
 * ║    Get free key: https://aistudio.google.com        ║
 * ║    Leave empty if you don't want AI features        ║
 * ║                                                      ║
 * ║  BLOCK_COUNTRIES → Block specific country numbers   ║
 * ║    Leave as [] to allow everyone (recommended)      ║
 * ║    Example to block a country:                      ║
 * ║    { code: '44', name: 'UK', minLen: 12 }           ║
 * ║                                                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

module.exports = {

  // ── command prefix ────────────────────────────────────
  PREFIX: '.',

  // ── bot identity ──────────────────────────────────────
  BOT_NAME: 'GARFIELD',

  // ── your whatsapp number (no + sign) ──────────────────
  OWNER_NUMBER: '94711502119',

  // ── who can use the bot ───────────────────────────────
  // public | private | groups | inbox
  MODE: 'public',

  // ── auto read messages ────────────────────────────────
  READ_MESSAGE: 'false',

  // ── google gemini api key (optional) ─────────────────
  // get free key → https://aistudio.google.com
  // leave empty string '' if not using AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  // ── block countries (optional) ────────────────────────
  // leave as [] to allow all countries
  // add entry to block: { code: 'dialcode', name: 'Country', minLen: numberLength }
  BLOCK_COUNTRIES: [],

}
