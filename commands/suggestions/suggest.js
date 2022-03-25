const { SlashCommandBuilder } = require('@discordjs/builders')
const { createSuggestion } = require('../../modules/suggestions')
const { plantillas } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'suggest',
  module: 'suggestions',
  description: '💡 Make a suggestion',
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addStringOption(input => input.setName('suggestion').setDescription('The suggestion').setRequired(true)),
  runInteraction (locale, interaction) {
    createSuggestion(interaction.member, interaction.options.getString('suggestion'), suggestionId => {
      if (!suggestionId) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'SUGGEST::ERROR'))] })
      return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'SUGGEST::SUCCESS', { SUGGESTIONID: suggestionId }))] })
    })
  },
  runCommand (locale, message) {
    if (!Object.prototype.hasOwnProperty.call(message.parameters, 0)) {
      return message.reply({
        embeds: plantillas.ayuda({
          name: 'suggest',
          description: i18n(locale, 'SUGGEST::DESCRIPTION'),
          module: 'suggestions',
          parameters: '<suggestion ··>',
          cooldown: 'Determined by the guild'
        })
      })
    }

    createSuggestion(message.member, message.parameters.join(' '), suggestionId => {
      if (!suggestionId) return message.reply({ embeds: [plantillas.error(i18n(locale, 'SUGGEST::ERROR'))] })
      return message.reply({ embeds: [plantillas.conexito(i18n(locale, 'SUGGEST::SUCCESS', { SUGGESTIONID: suggestionId }))] })
    })
  }
}
