const { Serializer } = require('klasa')
const { Emoji, GuildEmoji } = require('discord.js')

module.exports = class extends Serializer {
  constructor (...args) {
    super(...args, {
      aliases: ['emoji', 'guildemoji']
    })
  }

  // This function is used to tell Settings what this data is actually representing
  deserialize (data, piece, language, guild) {
    if (!guild) throw this.client.languages.default.get('RESOLVER_INVALID_GUILD', piece.key)
    if (data instanceof Emoji || data instanceof GuildEmoji) return data
    const emoji = this.constructor.regex.emoji.test(data) ? guild.emojis.resolve(this.constructor.regex.emoji.exec(data)[1]) : guild.emojis.resolve(data)
    if (emoji) return emoji
    throw language.get('RESOLVER_INVALID_EMOJI', piece.key)
  }

  // This function is used to tell Settings what this data should be stored as
  serialize (value) {
    return value.id
  }

  // This function is used to tell Settings what we should display the deserialized data as
  stringify (value, message) {
    const emoji = message.guild.emojis.resolve(value)
    return emoji ? emoji.name : value
  }
}
