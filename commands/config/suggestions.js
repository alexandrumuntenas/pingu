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
    .addSubcommand(sc => sc.setName('setchannel').setDescription('Set the channel where the bot will send the suggestions').addChannelOption(input => input.setName('channel').setDescription('Set the channel where the bot will send the suggestions').addChannelType(ChannelType.GuildText)))
    .addSubcommand(sc => sc.setName('setreviewer').setDescription('Set the role that can review suggestions').addRoleOption(input => input.setName('role').setDescription('Set the role that can review suggestions')))
    .addSubcommand(sc => sc.setName('setcooldown').setDescription('Set the cooldown between suggestions').addIntegerOption(input => input.setName('cooldown').setDescription('Set the cooldown between suggestions')))
    .addSubcommand(sc => sc.setName('communitybefore').setDescription('Before sending the suggestion to the staff, make the community review it.').addBooleanOption(input => input.setName('enable').setDescription('Before sending the suggestion to the staff, make the community review it.')))
    .addSubcommand(sc => sc.setName('communityafter').setDescription('After sending the suggestion to the staff, make the community review it.').addBooleanOption(input => input.setName('enable').setDescription('After sending the suggestion to the staff, make the community review it.')))
    .addSubcommand(sc => sc.setName('votingtimelimit').setDescription('Set the time limit for the voting phase').addIntegerOption(input => input.setName('time').setDescription('Set the time limit for the voting phase in minutes')))
    .addSubcommand(sc => sc.setName('setvotingchannel').setDescription('Set the channel where the bot will send the voting results').addChannelOption(input => input.setName('channel').setDescription('Set the channel where the bot will send the voting results').addChannelType(ChannelType.GuildText))),
  runInteraction () {
  }
}
