# GARFIELD WhatsApp Bot v11

<p align="center">
  <img src="https://github.com/Zenoixnoize/GARFIELD-WHATSAPP-BOT-v8/blob/asdf/Cloud/PicsArt_22-04-15_10-13-49-205.png" width="500"/>
</p>

<br/>

```
 ██████╗  █████╗ ██████╗ ███████╗██╗███████╗██╗     ██████╗     ██╗   ██╗ ██╗ ██╗
██║  ███╗███████║██████╔╝█████╗  ██║█████╗  ██║     ██║  ██║    ██║   ██║╚██║╚██║
██║   ██║██╔══██║██╔══██╗██╔══╝  ██║██╔══╝  ██║     ██║  ██║    ╚██╗ ██╔╝ ██║ ██║
╚██████╔╝██║  ██║██║  ██║██║     ██║███████╗███████╗██████╔╝     ╚████╔╝  ██║ ██║
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═════╝       ╚═══╝   ╚═╝ ╚═╝ 
```

<div align="center">

### `𝖳𝖧𝖤  𝖴𝖫𝖳𝖨𝖬𝖠𝖳𝖤  𝖶𝖧𝖠𝖳𝖲𝖠𝖯𝖯  𝖡𝖮𝖳  𝖥𝖮𝖱  𝖠𝖭𝖸  𝖯𝖫𝖠𝖳𝖥𝖮𝖱𝖬`

<br/>

![Version](https://img.shields.io/badge/VERSION-10.0.0-00ffcc?style=for-the-badge&logo=github&logoColor=black&labelColor=0a0a0a)
![Platform](https://img.shields.io/badge/PLATFORM-ANY-ff6600?style=for-the-badge&logo=windows&logoColor=white&labelColor=0a0a0a)
![API](https://img.shields.io/badge/API-BAILEYS-25D366?style=for-the-badge&logo=whatsapp&logoColor=white&labelColor=0a0a0a)
![Node](https://img.shields.io/badge/NODE.JS-20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white&labelColor=0a0a0a)
![Playwright](https://img.shields.io/badge/PLAYWRIGHT-CHROMIUM-40B5A4?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=0a0a0a)
![License](https://img.shields.io/badge/LICENSE-MIT-ff0055?style=for-the-badge&logoColor=white&labelColor=0a0a0a)
![Status](https://img.shields.io/badge/STATUS-ACTIVE-00ff88?style=for-the-badge&logoColor=white&labelColor=0a0a0a)

</div>

<br/>

---

<br/>

## ⚡ &nbsp; `𝖥𝖤𝖠𝖳𝖴𝖱𝖤𝖲`

```
╔══════════════════════════════════════════════════════════════════════╗
║  🎥  VIDEO UI SYSTEM                                                 ║
║      .menu and .alive render HD local MP4 inside WhatsApp            ║
╠══════════════════════════════════════════════════════════════════════╣
║  ⚡  BAILEYS POWERED — ULTRA LIGHTWEIGHT                             ║
║      Direct WebSocket · Anti-ban optimized · 512MB RAM ready         ║
║      QR login · Auto-reconnect · Works on any platform               ║
╠══════════════════════════════════════════════════════════════════════╣
║  📥  MEDIA DOWNLOAD SUITE                                            ║
║      YouTube MP3/M4A · Facebook Video · Android APK                  ║
║      Sri Lanka News · Format conversion via FFmpeg                   ║
╠══════════════════════════════════════════════════════════════════════╣
║  🛡️  GROUP MANAGEMENT                                                ║
║      Anti bad words auto-delete · Member list with @mentions         ║
╠══════════════════════════════════════════════════════════════════════╣
║  🔧  PLUGIN ARCHITECTURE                                             ║
║      Drop JS files into /plugins — auto loaded on startup            ╠══════════════════════════════════════════════════════════════════════╣
║  🌍  CROSS PLATFORM                                                  ║
║      Windows · macOS · Linux · VPS · Any server                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

<br/>

---

<br/>

## 📜 &nbsp; `𝖢𝖮𝖬𝖬𝖠𝖭𝖣 𝖯𝖠𝖭𝖤𝖫`

<div align="center">

| Command | Action | Category |
|:---:|:---|:---:|
| `.menu` | 🎬 Video Menu | `CORE` |
| `.alive` | 💚 Bot uptime & status | `CORE` |
| `.owner` | 👤 Developer info | `INFO` |
| `.song <query>` | 🎵 YouTube MP3 | `MEDIA` |
| `.play <query>` | 🎧 YouTube M4A | `MEDIA` |
| `.fb <url>` | 🎬 Facebook video | `MEDIA` |
| `.app <n>` | 📲 Android APK | `MEDIA` |
| `.news` | 📰 Sri Lanka news | `MEDIA` |
| `.sticker` | 🎨 Image/Video → Sticker | `TOOLS` |
| `.toimage` | 🖼️ Sticker → Image/Video | `TOOLS` |
| `.tomp3` | 🎙️ Video/Voice → MP3 | `TOOLS` |
| `.members` | 👥 Group member list | `GROUP` |

</div>

<br/>

---

<br/>

## 🛠 &nbsp; `𝖨𝖭𝖲𝖳𝖠𝖫𝖫𝖠𝖳𝖨𝖮𝖭  𝖦𝖴𝖨𝖣𝖤`

<br/>

---

### 🐧 &nbsp; Linux / VPS

<br/>

**Step 1 — Install Node.js, FFmpeg & Git**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git ffmpeg -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify
node -v    # v20.x.x
npm -v     # 10.x.x
ffmpeg -version
```

<br/>

**Step 2 — Clone the project**
```bash
git clone https://github.com/xnodesdevelopers/GARFIELD-V11-CORE.git
cd GARFIELD-V11-CORE
```

<br/>

**Step 3 — Install dependencies**
```bash
npm install
npx playwright install chromium
```

<br/>

**Step 4 — Configure**
```bash
nano config.js
```
```js
OWNER_NUMBER: '94711234567',   // your number without +
PREFIX:       '.',
MODE:         'public',
```

<br/>

**Step 5 — Add menu video**
```bash
# put your menuvideo.mp4 inside lib/ folder
ls lib/menuvideo.mp4   # must exist
```

<br/>

**Step 6 — First launch & scan QR**
```bash
node index.js
```
> 📱 QR code appears → Open WhatsApp → **Linked Devices** → **Link a Device** → Scan
> After scan press `Ctrl+C`

<br/>

**Step 7 — Install PM2 & start bot**
```bash
npm install -g pm2
npm start
```

<br/>

---

### 🪟 &nbsp; Windows

<br/>

**Step 1 — Install Node.js**
- Download from [https://nodejs.org](https://nodejs.org) → install LTS (v20+)
- Open **Command Prompt** and verify:
```cmd
node -v
npm -v
```

<br/>

**Step 2 — Install FFmpeg**
- Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
- Extract and add `ffmpeg/bin` to **System PATH**
- Verify:
```cmd
ffmpeg -version
```

<br/>

**Step 3 — Install Git**
- Download from [https://git-scm.com](https://git-scm.com) → install

<br/>

**Step 4 — Clone & install**
```cmd
git clone https://github.com/xnodesdevelopers/GARFIELD-V11-CORE.git
cd GARFIELD-V11-CORE
npm install
npx playwright install chromium
```

<br/>

**Step 5 — Configure**
```cmd
notepad config.js
```
```js
OWNER_NUMBER: '94711234567',   // your number without +
PREFIX:       '.',
MODE:         'public',
```

<br/>

**Step 6 — Add menu video**
- Put `menuvideo.mp4` inside the `lib/` folder

<br/>

**Step 7 — First launch & scan QR**
```cmd
node index.js
```
> 📱 QR code appears → Open WhatsApp → **Linked Devices** → **Link a Device** → Scan
> After scan press `Ctrl+C`

<br/>

**Step 8 — Install PM2 & start bot**
```cmd
npm install -g pm2
npm start
```

<br/>

---

### 🍎 &nbsp; macOS

<br/>

**Step 1 — Install Homebrew** *(if not installed)*
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

<br/>

**Step 2 — Install Node.js, FFmpeg & Git**
```bash
brew install node ffmpeg git
node -v
ffmpeg -version
```

<br/>

**Step 3 — Clone & install**
```bash
git clone https://github.com/xnodesdevelopers/GARFIELD-V11-CORE.git
cd GARFIELD-V11-CORE
npm install
npx playwright install chromium
```

<br/>

**Step 4 — Configure**
```bash
nano config.js
```
```js
OWNER_NUMBER: '94711234567',   // your number without +
PREFIX:       '.',
MODE:         'public',
```

<br/>

**Step 5 — Add menu video**
- Put `menuvideo.mp4` inside the `lib/` folder

<br/>

**Step 6 — First launch & scan QR**
```bash
node index.js
```
> 📱 QR code appears → Open WhatsApp → **Linked Devices** → **Link a Device** → Scan
> After scan press `Ctrl+C`

<br/>

**Step 7 — Install PM2 & start bot**
```bash
npm install -g pm2
npm start
```

<br/>

---

<br/>

## 🔄 &nbsp; `𝖯𝖬𝟐  𝖢𝖮𝖬𝖬𝖠𝖭𝖣𝖲`

> PM2 keeps your bot running 24/7. Auto-restarts on crash. Survives server reboots.

<br/>

| Command | Action |
|:---|:---|
| `npm start` | ▶️ Start the bot |
| `npm stop` | ⏹️ Stop the bot |
| `npm run restart` | 🔄 Restart the bot |
| `npm run logs` | 📋 View live logs |
| `npm run status` | 📊 Check bot status |

<br/>

**Auto-start on server reboot:**
```bash
pm2 save          # save current process list
pm2 startup       # copy & run the command it gives you
```

<br/>

**View logs:**
```bash
npm run logs
# Press Ctrl+C to exit logs
```

<br/>

**Check if bot is running:**
```bash
npm run status
```
```
┌─────┬───────────┬─────────┬──────┬───────────┬──────────┐
│ id  │ name      │ status  │ cpu  │ mem       │ uptime   │
├─────┼───────────┼─────────┼──────┼───────────┼──────────┤
│ 0   │ garfield  │ online  │ 0%   │ 85mb      │ 2D       │
└─────┴───────────┴─────────┴──────┴───────────┴──────────┘
```

<br/>

---

<br/>

## 📂 &nbsp; `𝖯𝖱𝖮𝖩𝖤𝖢𝖳  𝖲𝖳𝖱𝖴𝖢𝖳𝖴𝖱𝖤`

```
GARFIELD-V11-CORE/
│
├── 📄 index.js               ← Bot entry point
├── 📄 command.js             ← Plugin registry
├── 📄 config.js              ← Your settings (owner, prefix, mode)
├── 📄 package.json           ← Dependencies & npm scripts
├── 📄 ecosystem.config.js    ← PM2 configuration
│
├── 📁 plugins/               ← All commands (drop & auto-load)
│   ├── alive.js
│   ├── antiBadWords.js
│   ├── app.js
│   ├── fb.js
│   ├── members.js
│   ├── menu.js
│   ├── news.js
│   ├── owner.js
│   ├── play.js
│   ├── song.js
│   ├── sticker.js
│   ├── toimage.js
│   └── tomp3.js
│
├── 📁 sessions/              ← Auto-generated (don't delete)
└── 📁 lib/
    ├── menuvideo.mp4         ← ⚠️ Required — add your video here
    └── store/                ← Temp files (auto-cleanup)
```

<br/>

---

<br/>

## ❓ &nbsp; `𝖢𝖮𝖬𝖬𝖮𝖭  𝖨𝖲𝖲𝖴𝖤𝖲`

<br/>

**Bot not responding?**
```bash
npm run logs     # check for errors
npm run restart  # restart bot
```

**QR expired?**
```bash
# Delete session and re-scan
rm -rf sessions/
node index.js    # scan new QR
```

**Sticker / tomp3 not working?**
```bash
# Make sure ffmpeg is installed
ffmpeg -version
```

**Song / news not working?**
```bash
# Make sure playwright chromium is installed
npx playwright install chromium
```

<br/>

---

<br/>

## 🏆 &nbsp; `𝖦𝖨𝖵𝖤  𝖢𝖱𝖤𝖣𝖨𝖳`

> **This is the 100% original project — every file, every plugin, every line of code built from scratch by Tharindu Liyanage. If you use, fork, or deploy this — give proper credit. 🙏**

```
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ✅  Keep the original developer name visible in your README        ║
║   ✅  Link back to this repository in your fork or project           ║
║   ✅  Do NOT remove the footer or claim this as your own original    ║
║   ✅  A simple credit line costs nothing — it supports open source   ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
```

**Original Author:** [Tharindu Liyanage](https://github.com/xnodesdevelopers) · **Xnodes Development**
**Repository:** `https://github.com/xnodesdevelopers/GARFIELD-V11-CORE`

> *"Hours of real work went into building this from scratch. Respect that with a credit."*

<br/>

---

<br/>

## 👨‍💻 &nbsp; `𝖣𝖤𝖵𝖤𝖫𝖮𝖯𝖤𝖱`

<div align="center">

| &nbsp; | Detail |
|:---:|:---|
| 🏗️ **Architect** | Tharindu Liyanage |
| 🌐 **Organization** | [Xnodes Development](https://github.com/xnodesdevelopers) |
| 🎓 **University** | UOR · Faculty of Applied Science |
| 🐺 **Vibe** | Introvert · Codeaholic · Night Owl |
| 📍 **Origin** | 🇱🇰 Sri Lanka |

</div>

<br/>

---

<br/>

## ⚠️ &nbsp; `𝖣𝖨𝖲𝖢𝖫𝖠𝖨𝖬𝖤𝖱`

```
This project is developed for educational and personal automation purposes only.
The developer holds no responsibility for misuse of this software.
WhatsApp is a trademark of Meta Platforms, Inc.
Use responsibly and comply with WhatsApp's Terms of Service.
```

<br/>

---

<br/>

<div align="center">

```
██╗  ██╗███╗  ██╗ ██████╗ ██████╗ ███████╗███████╗
╚██╗██╔╝████╗ ██║██╔═══██╗██╔══██╗██╔════╝██╔════╝
 ╚███╔╝ ██╔██╗██║██║   ██║██║  ██║█████╗  ███████╗
 ██╔██╗ ██║╚████║██║   ██║██║  ██║██╔══╝  ╚════██║
██╔╝╚██╗██║ ╚███║╚██████╔╝██████╔╝███████╗███████║
╚═╝  ╚═╝╚═╝  ╚══╝ ╚═════╝ ╚═════╝ ╚══════╝╚══════╝
```

### `© 2026  Ｘｎｏｄｅｓ  ·  All Rights Reserved`
### `𝖯𝖮𝖶𝖤𝖱𝖤𝖣  𝖡𝖸  𝖦𝖠𝖱𝖥𝖨𝖤𝖫𝖣  𝖡𝖮𝖳  𝖵𝟏𝟎  🐼🔥`

<br/>

*If this project helped you, drop a ⭐ on GitHub — it means the world!*

`[ GARFIELD v10 · XNODES · THARINDU LIYANAGE · 2026 ]`

</div>
