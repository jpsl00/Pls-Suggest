const { Command } = require('klasa')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor (...args) {
    /**
     * Any default options can be omitted completely.
     * if all options are default, you can omit the constructor completely
     */
    super(...args, {
      enabled: true,
      runIn: ['text'],
      requiredPermissions: [],
      requiredSettings: [
        'suggestionChannel'
      ],
      aliases: ['deny', 'reject', 'delete'],
      bucket: 1,
      guarded: true,
      permissionLevel: 6,
      subcommands: false,
      description: lang => lang.get('COMMAND_SUGGESTIONS_REJECT_DESCRIPTION'),
      usage: '<Message:suggestion>'
    })
  }

  async run (message, [suggestion]) {
    const { language } = message
    const { suggestions } = message.guild.settings
    if (suggestions.find(el => el === suggestion.fullID)) {
      const authorEmbed = new MessageEmbed()
        .setTitle(language.get('COMMAND_SUGGESTIONS_REJECT_AUTHOR_TITLE'))
        .setColor('#e84118')
        .setThumbnail(message.guild.iconURL())
        .setDescription(language.get('COMMAND_SUGGESTIONS_REJECT_AUTHOR_DESCRIPTION', message.member.displayName, suggestion.splitContent(0, 512, true)))
        .setFooter(message.member.displayName, message.author.displayAvatarURL())
      await suggestion.author.send(authorEmbed)

      await message.guild.settings.update('suggestions', message.fullID, { action: 'remove' })

      await message.sendMessage(language.get('COMMAND_SUGGESTIONS_REJECT_REPLY', suggestion.member.displayName))
      return suggestion.delete({ reason: language.get('COMMAND_SUGGESTIONS_REJECT_SUGGESTION_REJECTED', message.member.displayName) })
    }
    // This is where you place the code you want to run for your command
  }

  async init () {
    /*
         * You can optionally define this method which will be run when the bot starts
         * (after login, so discord data is available via this.client)
         */
  }
}
