const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')

module.exports = {
  name: 'suggestion',
  module: 'suggestions',
  description: '📖 Manage the suggestions',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('approve').setDescription('Approve a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID')))
    .addSubcommand(sc => sc.setName('reject').setDescription('Reject a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID')).addStringOption(input => input.setName('reason').setDescription('The reason for rejecting the suggestion')))
    .addSubcommand(sc => sc.setName('addnote').setDescription('Add a note to a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID')).addStringOption(input => input.setName('note').setDescription('The note to add')))
    .addSubcommand(sc => sc.setName('blacklist').setDescription('Blacklist a user').addUserOption(input => input.setName('user').setDescription('The user to blacklist')).addStringOption(input => input.setName('reason').setDescription('The reason for blacklisting the user'))),
  runInteraction () {
  }
}
