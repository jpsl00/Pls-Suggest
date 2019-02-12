const { Argument } = require('klasa')

module.exports = class extends Argument {
  constructor (...args) {
    super(...args, {
      aliases: ['suggestion']
    })
  }

  async run (arg, possible, message) {
    if (typeof arg !== 'string') return
    const [channelID, messageID] = arg.split('-', 2)
    if (!(channelID && messageID)) return

    const channel = this.client.serializers.get('channel').deserialize(channelID,
      { key: possible.name, type: 'textchannel' }, message.language, message.guild)
    const messagePromise = this.constructor.regex.snowflake.test(messageID) ? channel.messages.fetch(messageID) : null
    if (messagePromise) return messagePromise
    // Yes, the split is supposed to be text, not code
    throw message.language.get('RESOLVER_INVALID_MESSAGE', `${possible.name}.split('-')[1]`)
  }
}