const { SlashCommandBuilder } = require('@discordjs/builders')
const { Help } = require('../../modules/constructor/messageBuilder')
const helpPages = require('./helppages.json')

module.exports = {
  name: 'help',
  description: 'Feeling lost? This command will help you out!',
  permissions: [],
  interactionData: new SlashCommandBuilder().setName('help').setDescription('Feeling lost? This command will help you out!').addStringOption(option => option.setName('module').setDescription('The category of help you want to see')).addStringOption(option => option.setName('command').setDescription('The command of help you want to see')),
  executeInteraction (client, locale, interaction) {
    if (interaction.options.getString('module')) {
      /* module page */
    } else if (interaction.options.getString('command')) {
      /* command page */
    } else {
      /* category showcase */
    }
  },
  executeLegacy (client, locale, message) {
    if (message.args && Object.prototype.hasOwnProperty.call(message.args, '0')) {
      /* lookup for command or module */
    } else {
      /* category showcase */
    }
  }
}
