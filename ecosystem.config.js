module.exports = {
  apps: [{
    name:                  'garfield',
    script:                'index.js',

    // ── memory & restart ──────────────────
    max_memory_restart:    '300M',   // tight limit — restart before OOM kill
    restart_delay:         5000,     // wait 5s before restart (avoid rapid loops)
    max_restarts:          10,       // stop trying after 10 crashes
    min_uptime:            '15s',    // must stay up 15s to count as stable

    // ── performance ───────────────────────
    node_args:             '--max-old-space-size=256',  // hard cap V8 heap to 256MB
    autorestart:           true,
    watch:                 false,    // no file watching — saves CPU

    // ── logs (minimal) ────────────────────
    error_file:            '/dev/null',  // discard error logs to save disk
    out_file:              '/dev/null',  // discard out logs to save disk
    merge_logs:            false,

    // ── env ───────────────────────────────
    env: {
      NODE_ENV: 'production',
    }
  }]
}
