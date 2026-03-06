module.exports = {
  apps: [{
    name:               'garfield',
    script:             'index.js',
    max_memory_restart: '450M',
    restart_delay:      3000,
    max_restarts:       10,
    min_uptime:         '10s',
    autorestart:        true,
    watch:              false,
    error_file:         './logs/error.log',
    out_file:           './logs/out.log',
    merge_logs:         true,
  }]
}
