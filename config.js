module.exports = {
  PREFIX:        '.',
  BOT_NAME:      'GARFIELD',
  OWNER_NUMBER:  '94711502119',

  // public  → everyone (default)
  // private → owner only
  // groups  → groups only
  // inbox   → DMs only
  MODE: 'public',

  READ_MESSAGE:   'false',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'AIzaSyAl90hhWpJvPSH1Oo4biJyi2pHOdcfEtz0',

  BLOCK_COUNTRIES: [
    { code: '212', name: 'Morocco', minLen: 12 },
  ],
}