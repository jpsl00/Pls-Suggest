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
      aliases: ['suggestion', 'sugg', 'su', 's'],
      bucket: 1,
      guarded: true,
      permissionLevel: 6,
      subcommands: false,
      description: lang => lang.get('COMMAND_SUGGESTIONS_APPROVE'),
      usage: '<Message:suggestion>'
    })
  }

  async run (message, [suggestion]) {
    const { language } = message
    const { suggestions, suggestionChannel } = message.guild.settings
    if (suggestions.find(el => el === suggestion.fullID)) {
      const authorEmbed = new MessageEmbed()
        .setTitle(language.get('COMMAND_SUGGESTIONS_APPROVE_AUTHOR_TITLE'))
        .setColor('#4cd137')
        .setThumbnail(message.guild.iconURL)
        .setDescription(`${language.get('COMMAND_SUGGESTIONS_APPROVE_AUTHOR_DESCRIPTION')}\`\`\`js\n${suggestion.splitContent(0, 512, true)}\`\`\``)
        .setFooter(message.member.displayName, message.author.displayAvatarURL())
      await suggestion.author.send(authorEmbed)

      await message.guild.settings.update('suggestions', message.fullID, { action: 'remove' })

      await message.sendLocale('COMMAND_SUGGESTIONS_APPROVE_REPLY', { message: suggestion })
      return suggestion.delete({ reason: language.get('COMMAND_SUGGESTIONS_APPROVE_SUGGESTION_APPROVED') })
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
