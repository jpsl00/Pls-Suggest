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
      description: lang => lang.get('COMMAND_SUGGESTION_REJECT_DESCRIPTION'),
      deletable: false,
      usage: '<Message:suggestion>'
    })
  }

  async run (message, [suggestion]) {
    const { language } = message
    const { suggestions } = message.guild.settings
    if (suggestions.find(el => el === suggestion.fullID)) {
      const authorEmbed = new MessageEmbed()
        .setTitle(language.get('COMMAND_SUGGESTION_REJECT_AUTHOR_TITLE'))
        .setTimestamp()
        .setColor('#e84118')
        .setThumbnail(message.guild.iconURL())
        .setDescription(language.get('COMMAND_SUGGESTION_REJECT_AUTHOR_DESCRIPTION', message.member ? message.member.displayName : message.author.username, suggestion.splitContent(0, 512, true)))
        .setFooter(message.member ? message.member.displayName : message.author.username, message.author.displayAvatarURL())
      await suggestion.author.send(authorEmbed).catch(e => {})

      await message.guild.settings.update('suggestions.pending', message.fullID, { action: 'remove' })
      await message.guild.settings.update('suggestions.rejected', {
        content: suggestion.cleanContent,
        author: suggestion.author.id,
        manager: message.author.id
      }, { action: 'add' })

      await suggestion.delete({ reason: language.get('COMMAND_SUGGESTION_REJECT_DELETE_REASON', message.member ? message.member.displayName : message.author.username) })
      return message.sendMessage(language.get('COMMAND_SUGGESTION_REJECT_REPLY', suggestion.member.displayName)).then((m) => setTimeout((m) => {
        if (!m) return
        const embed = new MessageEmbed()
          .setTitle(language.get('COMMAND_SUGGESTION_REJECT_EMBED_TITLE'))
          .setTimestamp()
          .setColor('#e84118')
          .setDescription(language.get('COMMAND_SUGGESTION_REJECT_AFTER_DESCRIPTION', suggestion.splitContent(0, 800), suggestion.author, message.author))

        if (m.editable) {
          return m.edit('', embed)
        } else {
          return m.delete().then(m.channel.send(embed))
        }
      }, 15000)
      )
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
