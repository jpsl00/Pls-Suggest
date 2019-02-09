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
      .add('suggestions', 'message', {
        configurable: true,
        array: true
      })
      /* folder => folder
        .add('id', 'message')
        .add('votes', subfolder => subfolder
          .add('user', 'user')
          .add('suggestion', 'string')
          .add('message', 'message')
          .add('voteStrength', 'integer')
        )
      , {
        configurable: false,
        array: true
      }) */
      .add('reactions', folder => folder
        .add('upvote', 'emoji', {
          default: config.suggestion.upvote,
          configurable: true
        })
        .add('downvote', 'emoji', {
          default: config.suggestion.upvote,
          configurable: true
        })
      )
  }
}

const client = new SuggestionClient()

client.setup()
