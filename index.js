/**
 * ◈ GARFIELD-V11-CORE ◈
 * * This architectural core is engineered for performance.
 * Designed & Developed by Tharindu Liyanage
 * * © 2026 Xnodes Laboratory. All rights reserved.
 * ---------------------------------------------------------
 */
'use strict'

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  getContentType,
  jidDecode,
} = require('@whiskeysockets/baileys')

const P         = require('pino')
const NodeCache = require('node-cache')
const fs        = require('fs')
const path      = require('path')
const qrcode    = require('qrcode-terminal')
const config    = require('./config')
const { commands } = require('./command')

const SESSION_DIR = path.join(__dirname, 'sessions')
const PLUGINS_DIR = path.join(__dirname, 'plugins')
const CREDS_FILE  = path.join(SESSION_DIR, 'creds.json')

;[SESSION_DIR, PLUGINS_DIR].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })
})

const msgRetryCache = new NodeCache()

// ── plugin loader ─────────────────────────────────────────────
function loadPlugins() {
  const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js'))
  if (!files.length) return console.log('⚠️  No plugins found\n')
  console.log(`\n📦 Loading ${files.length} plugin(s)...`)
  let ok = 0
  for (const file of files) {
    try {
      const p = path.join(PLUGINS_DIR, file)
      delete require.cache[require.resolve(p)]
      require(p)
      console.log(`   ✅ ${file}`)
      ok++
    } catch (e) {
      console.error(`   ❌ ${file}: ${e.message}`)
    }
  }
  console.log(`   ${ok}/${files.length} loaded\n`)
}

// ── country block ─────────────────────────────────────────────
function isBlocked(num) {
  const list = config.BLOCK_COUNTRIES
  if (!list?.length) return false
  const n = num.replace(/\D/g, '')
  for (const c of list) {
    if (n.startsWith(c.code) && n.length >= (c.minLen || 11)) return c.name
  }
  return false
}

// ── message detector ──────────────────────────────────────────
function detectMsg(mek) {
  const raw  = mek.message
  const type = getContentType(raw)

  const isText     = type === 'conversation' || type === 'extendedTextMessage'
  const isImage    = type === 'imageMessage'
  const isVideo    = type === 'videoMessage'
  const isAudio    = type === 'audioMessage'
  const isSticker  = type === 'stickerMessage'
  const isDocument = type === 'documentMessage'
  const isLocation = type === 'locationMessage'
  const isContact  = type === 'contactMessage' || type === 'contactsArrayMessage'
  const isReaction = type === 'reactionMessage'
  const isViewOnce = type === 'viewOnceMessage' || type === 'viewOnceMessageV2'
  const isVoice    = isAudio && raw.audioMessage?.ptt === true
  const isGif      = isVideo && raw.videoMessage?.gifPlayback === true

  const body =
    type === 'conversation'        ? raw.conversation :
    type === 'extendedTextMessage' ? raw.extendedTextMessage?.text :
    isImage    ? raw.imageMessage?.caption    || '' :
    isVideo    ? raw.videoMessage?.caption    || '' :
    isDocument ? raw.documentMessage?.caption || '' :
    isReaction ? raw.reactionMessage?.text    || '' : ''

  const mime =
    isImage    ? raw.imageMessage?.mimetype    :
    isVideo    ? raw.videoMessage?.mimetype    :
    isAudio    ? raw.audioMessage?.mimetype    :
    isSticker  ? raw.stickerMessage?.mimetype  :
    isDocument ? raw.documentMessage?.mimetype : null

  const quotedCtx     = type === 'extendedTextMessage'
    ? raw.extendedTextMessage?.contextInfo || null : null
  const quoted        = quotedCtx?.quotedMessage || null
  const mentionedJids = quotedCtx?.mentionedJid  || []

  const msgType =
    isGif      ? 'gif'      : isVoice    ? 'voice'    :
    isText     ? 'text'     : isImage    ? 'image'    :
    isVideo    ? 'video'    : isAudio    ? 'audio'    :
    isSticker  ? 'sticker'  : isDocument ? 'document' :
    isLocation ? 'location' : isContact  ? 'contact'  :
    isReaction ? 'reaction' : isViewOnce ? 'viewonce' : 'unknown'

  return {
    msgType,
    isText, isImage, isVideo, isAudio, isVoice,
    isSticker, isDocument, isLocation, isContact,
    isReaction, isViewOnce, isGif,
    body: body || '', mime, quoted, mentionedJids,
  }
}

// ── sender info ───────────────────────────────────────────────
function getSender(conn, mek) {
  const from      = mek.key.remoteJid
  const isGroup   = from.endsWith('@g.us')
  const botNumber = conn.user.id.split(':')[0]
  const isSelf    = mek.key.fromMe === true
  const sender    = isSelf
    ? botNumber + '@s.whatsapp.net'
    : (isGroup ? mek.key.participant : from) || from
  const senderNum = sender.split('@')[0]

  return {
    from, sender, senderNum,
    pushname:  mek.pushName || 'User',
    isOwner:   senderNum === config.OWNER_NUMBER || isSelf,
    isSelf,
    isGroup,
    isPrivate: !isGroup,
    groupJid:  isGroup ? from : null,
    botNumber,
  }
}

// ── message handler ───────────────────────────────────────────
async function handleMessage(conn, mek) {
  try {
    if (!mek?.message) return

    // unwrap ephemeral & viewOnce
    const topType = getContentType(mek.message)
    if      (topType === 'ephemeralMessage')   mek.message = mek.message.ephemeralMessage.message
    else if (topType === 'viewOnceMessage')    mek.message = mek.message.viewOnceMessage.message
    else if (topType === 'viewOnceMessageV2')  mek.message = mek.message.viewOnceMessageV2.message

    if (!mek.message) return

    const from = mek.key.remoteJid
    if (!from || from === 'status@broadcast') return

    // guard: group message must have participant
    if (from.endsWith('@g.us') && !mek.key.participant) return

    const who  = getSender(conn, mek)
    const what = detectMsg(mek)
    const { body } = what

    // country block
    const blocked = isBlocked(who.senderNum)
    if (blocked) {
      return conn.sendMessage(from, {
        text: `*This Bot is not available in ${blocked} 🔒*\n` +
              `Deploy your own:\nhttps://github.com/xnodesdevelopers/GARFIELD-WHATSAPP-BOT-v10\n` +
              `_Xnodes Development © 2026_`
      }, { quoted: mek })
    }

    // mode gate — isSelf always passes
    if (!who.isSelf) {
      if (config.MODE === 'private' && !who.isOwner) return
      if (config.MODE === 'groups'  && !who.isGroup) return
      if (config.MODE === 'inbox'   &&  who.isGroup) return
    }

    const isCmd = body.startsWith(config.PREFIX)
    const args  = body.trim().split(/ +/).slice(1)
    const cmd   = isCmd
      ? body.slice(config.PREFIX.length).trim().split(' ')[0].toLowerCase()
      : ''

    const reply = (text)  => conn.sendMessage(from, { text }, { quoted: mek })
    const react = (emoji) => conn.sendMessage(from, { react: { text: emoji, key: mek.key } })

    const ctx = {
      from,
      sender:        who.sender,
      senderNum:     who.senderNum,
      pushname:      who.pushname,
      botNumber:     who.botNumber,
      isOwner:       who.isOwner,
      isSelf:        who.isSelf,
      isGroup:       who.isGroup,
      isPrivate:     who.isPrivate,
      groupJid:      who.groupJid,
      msgType:       what.msgType,
      isText:        what.isText,
      isImage:       what.isImage,
      isVideo:       what.isVideo,
      isAudio:       what.isAudio,
      isVoice:       what.isVoice,
      isSticker:     what.isSticker,
      isDocument:    what.isDocument,
      isGif:         what.isGif,
      isViewOnce:    what.isViewOnce,
      isReaction:    what.isReaction,
      isLocation:    what.isLocation,
      isContact:     what.isContact,
      body,
      mime:          what.mime,
      quoted:        what.quoted,
      mentionedJids: what.mentionedJids,
      isCmd, cmd, args, q: args.join(' '),
      reply, react, conn, mek,
    }

    // named command
    if (isCmd) {
      const plugin = commands.find(c => c.pattern === cmd)
                  || commands.find(c => c.alias?.includes(cmd))
      if (plugin) {
        if (plugin.react) await react(plugin.react)
        try   { await plugin.function(conn, mek, ctx) }
        catch (e) { console.error(`[CMD] ${cmd}:`, e.message) }
      }
      return
    }

    // event plugins
    for (const c of commands) {
      if (!c.on) continue
      try {
        switch (c.on) {
          case 'text':     if (what.isText)     await c.function(conn, mek, ctx); break
          case 'image':    if (what.isImage)    await c.function(conn, mek, ctx); break
          case 'video':    if (what.isVideo)    await c.function(conn, mek, ctx); break
          case 'audio':    if (what.isAudio)    await c.function(conn, mek, ctx); break
          case 'voice':    if (what.isVoice)    await c.function(conn, mek, ctx); break
          case 'sticker':  if (what.isSticker)  await c.function(conn, mek, ctx); break
          case 'document': if (what.isDocument) await c.function(conn, mek, ctx); break
          case 'reaction': if (what.isReaction) await c.function(conn, mek, ctx); break
        }
      } catch (e) { console.error(`[EVENT] ${c.on}:`, e.message) }
    }

  } catch (e) { console.error('[MSG]', e.message) }
}

// ── connect ───────────────────────────────────────────────────
async function connectToWA() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR)
  const { version }          = await fetchLatestBaileysVersion()

  console.log(fs.existsSync(CREDS_FILE)
    ? '✅ Session found → connecting...\n'
    : '📱 No session → scan QR below\n'
  )

  const conn = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys:  makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })),
    },
    logger:                         P({ level: 'silent' }),
    printQRInTerminal:              false,
    browser:                        ['Ubuntu', 'Chrome', '126.0.6478.127'],
    syncFullHistory:                false,
    markOnlineOnConnect:            false,
    generateHighQualityLinkPreview: false,
    getMessage:                     async () => undefined,
    msgRetryCounterMap:             msgRetryCache,
  })

  // new conn = fresh listeners, no stacking on reconnect
  conn.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrcode.generate(qr, { small: true })
      console.log('Scan the QR above with WhatsApp\n')
    }
    if (connection === 'open') {
      console.log('🐼 GARFIELD BOT CONNECTED\n')
      loadPlugins()
    }
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      if (code === DisconnectReason.loggedOut) {
        console.log('Logged out → clearing session')
        fs.rmSync(SESSION_DIR, { recursive: true, force: true })
        return process.exit(0)
      }
      console.log(`Reconnecting (${code})...`)
      setTimeout(connectToWA, 3000)
    }
  })

  conn.ev.on('creds.update', saveCreds)

  conn.ev.on('messages.upsert', ({ messages, type }) => {
    if (type !== 'notify') return
    handleMessage(conn, messages[0])
  })

  conn.decodeJid = (jid) => {
    if (!jid) return jid
    if (/:\d+@/gi.test(jid)) {
      const d = jidDecode(jid) || {}
      return d.user && d.server ? `${d.user}@${d.server}` : jid
    }
    return jid
  }
}

// ── boot ──────────────────────────────────────────────────────
console.log('🐼 GARFIELD BOT v11 — Xnodes Development\n')
connectToWA()
