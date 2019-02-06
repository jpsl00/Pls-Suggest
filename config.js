/**
 * The following are all client options for Klasa/Discord.js.
 * Any option that you wish to use the default value can be removed from this file.
 * This file is init with defaults from both Klasa and Discord.js.
 */

exports.config = {
  /**
   * General Options
   */
  // Disables/Enables a process.on('unhandledRejection'...) handler
  production: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
  // The default language that comes with klasa. More base languages can be found on Klasa-Pieces
  language: 'en-US',
  // The default configurable prefix for each guild
  prefix: '!',
  // If custom settings should be preserved when a guild removes your bot
  preserveSettings: true,
  // If your bot should be able to mention @everyone
  disableEveryone: true,
  // Whether d.js should queue your rest request in 'sequential' or 'burst' mode
  apiRequestMethod: 'sequential',
  // The time in ms to add to ratelimits, to ensure you wont hit a 429 response
  restTimeOffset: 500,
  // Any Websocket Events you don't want to listen to
  disabledEvents: [],
  // A presence to login with
  presence: {},
  // A once ready message for your console
  readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.size} guild${client.guilds.size === 1 ? '' : 's'}.`,

  /**
   * Caching Options
   */
  fetchAllMembers: false,
  messageCacheMaxSize: 200,
  messageCacheLifetime: 0,
  commandMessageLifetime: 1800,
  // The above 2 options are ignored while the interval is 0
  messageSweepInterval: 0,

  /**
   * Command Handler Options
   */
  commandEditing: false,
  commandLogging: true,
  typing: false,

  /**
   * Database Options
   */
  providers: {
    /*
    // Provider Connection object for process based databases:
    // rethinkdb, mongodb, mssql, mysql, postgresql
    mysql: {
      host: 'localhost',
      db: 'klasa',
      user: 'database-user',
      password: 'database-password',
      options: {}
    },
    */
    default: 'mongodb',
    mongodb: {
      connectionURI: process.env.DB_URI,
      db: 'data'
    }
  },

  /**
   * Custom Prompt Defaults
   */
  customPromptDefaults: {
    time: 30000,
    limit: 1,
    quotedStringSupport: false
  },

  /**
   * Klasa Piece Defaults
   */
  pieceDefaults: {
    commands: {
      autoAliases: true,
      cooldown: 1,
      cooldownLevel: 'author',
      permissionLevel: 0,
      promptLimit: 1,
      runIn: ['text']
    },
    inhibitors: {
      spamProtection: false
    }
  },

  /**
   * Console Event Handlers (enabled/disabled)
   */
  consoleEvents: {
    debug: !this.production,
    error: true,
    log: true,
    verbose: false,
    warn: true,
    wtf: true
  },

  /**
   * Console Options
   */
  console: {
    // Alternatively a Moment Timestamp string can be provided to customize the timestamps.
    timestamps: !(process.env.NODE_ENV && process.env.NODE_ENV === 'production'),
    utc: false,
    colors: {
      debug: { time: { background: 'magenta' } },
      error: { time: { background: 'red' } },
      log: { time: { background: 'blue' } },
      verbose: { time: { text: 'gray' } },
      warn: { time: { background: 'lightyellow', text: 'black' } },
      wtf: { message: { text: 'red' }, time: { background: 'red' } }
    }
  },

  /**
   * Custom Setting Gateway Options
   */
  gateways: {
    guilds: {},
    users: {},
    clientStorage: {}
  },

  /**
   * Klasa Schedule Options
   */
  schedule: {
    interval: 60000
  },

  /**
   * Suggestion Options
   */
  suggestion: {
    upvote: '✔',
    downvote: '✖'
  }
}
