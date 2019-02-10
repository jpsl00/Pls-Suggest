const { Event } = require('klasa')

module.exports = class extends Event {
  constructor (...args) {
    super(...args, {
      enabled: true,
      event: 'raw',
      once: false
    })
  }

  async run (event) {
    // This is where you place the code you want to run for your event

    // Code slightly modified from https://gist.github.com/Lewdcario/52e1c66433c994c5c3c272284b9ab29c
    const events = {
      MESSAGE_REACTION_ADD: 'messageReactionAdd',
      MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
    }

    if (!events.hasOwnProperty(event.t)) return

    const { d: data } = event
    const user = this.client.users.get(data.user_id)
    const channel = this.client.channels.get(data.channel_id) || await user.createDM()

    if (channel.messages.has(data.message_id)) return

    const message = await channel.messages.fetch(data.message_id)
    const emojiKey = data.emoji.id || data.emoji.name
    const reaction = message.reactions.get(emojiKey) || message.reactions.add(data)

    this.client.emit(events[event.t], reaction, user)
    if (message.reactions.size === 1) message.reactions.delete(emojiKey)
  }

  async init () {
    /*
    * You can optionally define this method which will be run when the bot starts
    * (after login, so discord data is available via this.client)
    */
  }
}
