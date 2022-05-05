const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionsBitField } = require('discord.js')

module.exports = {
  name: 'boteditor',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  isconfigurationcommand: true,
  interaction: new SlashCommandBuilder(),
  runInteraction (interaction) {

  },
  runCommand (message) {

  }
}
