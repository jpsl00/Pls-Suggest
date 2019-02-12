const { Extendable } = require('klasa')
const { Message } = require('discord.js')

module.exports = class extends Extendable {
  constructor (...args) {
    /**
     * Any default options can be omitted completely.
     */
    super(...args, {
      enabled: true,
      appliesTo: [Message]
    })
  }

  get fullID () {
    return `${this.channel.id}-${this.id}`
    // `this` refers to the parent class, and not this one. You cannot use super.
  }

  splitContent (min = 0, max = 2048, clean = false) {
    const content = clean ? this.cleanContent : this.content
    if (content.length > max) {
      return `${content.substr(min, max)}...`
    } else return content
  }
}
