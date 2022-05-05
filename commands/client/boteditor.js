const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')

module.exports = {
  name: 'boteditor',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isconfigurationcommand: true,
  interaction: new SlashCommandBuilder(),
  runInteraction (interaction) {

  },
  runCommand (message) {

  }
}
