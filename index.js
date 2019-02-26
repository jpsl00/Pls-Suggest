const { Client } = require('klasa')
const { config } = require('./config')
class SuggestionClient extends Client {
  constructor () {
    super(config)

    // Add any properties to your Klasa Client
  }

  // Add any methods to your Klasa Client
  setup () {
    this.configDB()

    this.login()
  }

  configDB () {
    SuggestionClient.defaultGuildSchema
      .add('suggestionChannel', 'textchannel')
      .add('suggestions', folder => folder
        .add('rejected', 'any', {
          configurable: true, // For debug
          array: true
        })
        .add('approved', 'any', {
          configurable: true, // For debug
          array: true
        })
        .add('pending', 'message', {
          configurable: true, // For debug
          array: true
        })
      , {
        configurable: true
      })
      .add('reactions', folder => folder
        .add('upvote', 'emoji', {
          default: config.suggestion.upvote,
          configurable: true
        })
        .add('downvote', 'emoji', {
          default: config.suggestion.downvote,
          configurable: true
        })
      )
  }
}

const client = new SuggestionClient()

client.setup()
