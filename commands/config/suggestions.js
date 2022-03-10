const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { ChannelType } = require('discord-api-types/v9')

module.exports = {
  name: 'suggestions',
  module: 'suggestions',
  description: '⚙️ Configure the suggestions module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('dmupdates').setDescription('Send suggestion status updates to it\'s author?').addBooleanOption(input => input.setName('enable').setDescription('Send suggestion status updates to it\'s author?')))
    .addSubcommand(sc => sc.setName('setlogs').setDescription('Set the channel where the bot will send the suggestion logs').addChannelOption(input => input.setName('channel').setDescription('Set the channel where the bot will send the suggestion logs').addChannelType(ChannelType.GuildText)))
    .addSubcommand(sc => sc.setName('setchannel').setDescription('Set the channel where the bot will send the suggestions').addChannelOption(input => input.setName('channel').setDescription('Set the channel where the bot will send the suggestions').addChannelType(ChannelType.GuildText))),
  runInteraction () {
  }
}
