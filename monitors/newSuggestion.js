const { Monitor } = require('klasa')

module.exports = class extends Monitor {
  constructor (...args) {
    /**
     * Any default options can be omitted completely.
     * if all options are default, you can omit the constructor completely
     */
    super(...args, {
      enabled: true,
      ignoreOthers: false
    })
  }

  async run (message) {
    if (!message.guild || message.system || message.author.bot) return
    if (message.channel.id !== message.guild.settings.suggestionChannel) return
    const { upvote, downvote } = message.guild.settings.reactions
    message.guild.settings.update('suggestions', `${message.channel.id}-${message.id}`, {
      action: 'add'
    })
    return message.react(upvote, downvote).catch(() => {})/* .then(() => message
      .react(downvote)) */

    // This is where you place the code you want to run for your monitor
  }

  async init () {
    /*
    * You can optionally define this method which will be run when the bot starts
    * (after login, so discord data is available via this.client)
    */
  }
}
