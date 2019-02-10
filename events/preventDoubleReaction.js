const { Event } = require('klasa')

module.exports = class extends Event {
  constructor (...args) {
    super(...args, {
      enabled: true,
      event: 'messageReactionAdd',
      once: false
    })
  }

  run (reaction, user) {
    // This is where you place the code you want to run for your event
    const { message } = reaction
    const { channel, guild } = message

    if (channel.id !== guild.settings.suggestionChannel) return

    const { upvote, downvote } = guild.settings.reactions
    const reactionCount = message.reactions
      .filter(reac =>
        reac._emoji.name === upvote || reac._emoji.id === upvote ||
        reac._emoji.name === downvote || reac._emoji.id === downvote
      )
      .map(async react => {
        const users = await react.users.fetch(user.id)
        return users
      })
      .filter(entry => !!entry)
      .length

    if (!reactionCount) return

    if (user.bot) {
      if (this.client.user.equals(user)) return
      return reaction.users.remove(user)
    }

    if (reactionCount > 1) return reaction.users.remove(user)
  }

  async init () {
    /*
    * You can optionally define this method which will be run when the bot starts
    * (after login, so discord data is available via this.client)
    */
  }
}
