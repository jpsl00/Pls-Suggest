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
      aliases: ['approve', 'accept'],
      bucket: 1,
      guarded: true,
      permissionLevel: 6,
      subcommands: false,
      description: lang => lang.get('COMMAND_SUGGESTION_APPROVE_DESCRIPTION'),
      deletable: true,
      usage: '<Message:suggestion>'
    })
  }

  async run (message, [suggestion]) {
    const { language } = message
    const { suggestions, suggestionChannel } = message.guild.settings
    if (!suggestionChannel) return
    if (suggestions.pending.find(el => el === suggestion.fullID)) {
      const authorEmbed = new MessageEmbed()
        .setTitle(language.get('COMMAND_SUGGESTION_APPROVE_EMBED_TITLE'))
        .setTimestamp()
        .setColor('#4cd137')
        .setThumbnail(message.guild.iconURL())
        .setDescription(language.get('COMMAND_SUGGESTION_APPROVE_AUTHOR_DESCRIPTION', message.member ? message.member.displayName : message.author.username, suggestion.splitContent(0, 800, true)))
        .setFooter(message.member ? message.member.displayName : message.author.username, message.author.displayAvatarURL())
      await suggestion.author.send(authorEmbed).catch(e => {})

      await message.guild.settings.update('suggestions.pending', message.fullID, { action: 'remove' })
      await message.guild.settings.update('suggestions.approved', {
        content: suggestion.cleanContent,
        author: suggestion.author.id,
        manager: message.author.id
      }, { action: 'add' })

      await suggestion.delete({ reason: language.get('COMMAND_SUGGESTION_APPROVE_DELETE_REASON', message.member ? message.member.displayName : message.author.username) })
      await message.sendMessage(language.get('COMMAND_SUGGESTION_APPROVE_REPLY', suggestion.member.displayName))

      const embed = new MessageEmbed()
        .setTitle(language.get('COMMAND_SUGGESTION_APPROVE_EMBED_TITLE'))
        .setTimestamp()
        .setColor('#4cd137')
        .setDescription(language.get('COMMAND_SUGGESTION_APPROVE_AFTER_DESCRIPTION', suggestion.splitContent(0, 800), suggestion.author, message.author))

      return suggestionChannel.send(embed)
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
