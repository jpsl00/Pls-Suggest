const { Event } = require('klasa')

module.exports = class extends Event {
  constructor (...args) {
    super(...args, {
      enabled: true,
      event: 'messageReactionAdd',
      once: false
    })
  }

  async run (reaction, user) {
    // This is where you place the code you want to run for your event
    const { message } = reaction
    const { channel, guild } = message

    if (channel.id !== guild.settings.suggestionChannel) return

    const { upvote, downvote } = guild.settings.reactions
    const count = await Promise.all(message.reactions
      .filter(reac =>
        reac._emoji.name === upvote || reac._emoji.id === upvote ||
          reac._emoji.name === downvote || reac._emoji.id === downvote
      )
      .map(async react => {
        const users = await react.users.fetch().then(usrs =>
          usrs.filter(usr => usr.id === user.id))
        return users
      })
    ).then(result => result
      .map(entry => !!entry.size)
      .filter(entry => !!entry))

    if (!count || !count.length) return

    if (user.bot) {
      if (this.client.user.equals(user)) return
      return reaction.users.remove(user)
    }

    if (count.length > 1) return reaction.users.remove(user)
  }

  async init () {
    /*
    * You can optionally define this method which will be run when the bot starts
    * (after login, so discord data is available via this.client)
    */
  }
}
