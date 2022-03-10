const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'suggest',
  module: 'suggestions',
  description: '💡 Make a suggestion',
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addStringOption(input => input.setName('suggestion').setDescription('The suggestion')),
  runInteraction () {
  }
}
