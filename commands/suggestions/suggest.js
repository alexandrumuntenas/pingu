const { SlashCommandBuilder } = require('@discordjs/builders')
const { createSuggestion, checkIfUserIsBlacklisted } = require('../../modules/suggestions')
const { plantillas } = require('../../core/messageManager')
const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'suggest',
  module: 'suggestions',
  description: '💡 Make a suggestion',
  isConfigurationCommand: false,
  interaction: new SlashCommandBuilder()
    .addStringOption(input => input.setName('suggestion').setDescription('The suggestion').setRequired(true)),
  runInteraction (interaction) {
    checkIfUserIsBlacklisted(interaction.guild, interaction.member, isBlacklisted => {
      if (!isBlacklisted) {
        createSuggestion(interaction.member, interaction.options.getString('suggestion'), suggestionId => {
          if (!suggestionId) return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGEST::ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGEST::SUCCESS', { SUGGESTIONID: suggestionId }))] })
        })
      } else {
        interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGEST::BLACKLISTED'))] })
      }
    })
  },
  runCommand (message) {
    checkIfUserIsBlacklisted(message.guild, message.member, isBlacklisted => {
      if (!isBlacklisted) {
        if (!Object.prototype.hasOwnProperty.call(message.parameters, 0)) {
          return message.reply({
            embeds: plantillas.ayuda({
              name: 'suggest',
              description: i18n.getTranslation(message.guild.preferredLocale, 'SUGGEST::DESCRIPTION'),
              module: 'suggestions',
              parameters: '<suggestion ··>',
              cooldown: 'Determined by the guild'
            })
          })
        }

        createSuggestion(message.member, message.parameters.join(' '), suggestionId => {
          if (!suggestionId) return message.reply({ embeds: [plantillas.error(i18n.getTranslation(message.guild.preferredLocale, 'SUGGEST::ERROR'))] })
          return message.reply({ embeds: [plantillas.conexito(i18n.getTranslation(message.guild.preferredLocale, 'SUGGEST::SUCCESS', { SUGGESTIONID: suggestionId }))] })
        })
      } else {
        message.reply({ embeds: [plantillas.error(i18n.getTranslation(message.guild.preferredLocale, 'SUGGEST::BLACKLISTED'))] })
      }
    })
  }
}
