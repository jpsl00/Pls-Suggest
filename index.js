const Discord = require('discord.js')
require('dotenv').config()

const client = new Discord.Client()

client.on('ready', () => {
  console.log('Bot is ready to receive suggestions!')
})

client.on('message', m => {
  if (m.author.bot) return // Ignore bots
  if (m.channel.id === process.env.CHANNEL_ID) {
    console.log(`We've got a new suggestion!\nUser: ${m.author.tag} (${m.author.id})\nSuggestion: ${m.content}\n`)
    return m.react(process.env.UPVOTE).then(() => m.react(process.env.DOWNVOTE))
  }
})

client.login(process.env.TOKEN)
