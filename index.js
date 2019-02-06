const { Client } = require('klasa')
const { config } = require('./config')
class SuggestionClient extends Client {
  constructor () {
    super(config)

    // Add any properties to your Klasa Client
  }

  // Add any methods to your Klasa Client
  setup () {
    this.configSchemas()

    this.login()
  }

  configSchemas () {
    SuggestionClient.defaultGuildSchema
      .add('suggestionChannel', 'textchannel')
      .add('reactions', folder => folder
        .add('upvote', 'emoji', { default: config.suggestion.upvote })
        .add('downvote', 'emoji', { default: config.suggestion.downvote }))
  }
}

const client = new SuggestionClient()

client.setup()
