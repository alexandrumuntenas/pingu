const { getMemberSuggestions } = require('../../modules/suggestions')
const { plantillas } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')
const { MessageEmbed } = require('discord.js')
const unixTime = require('unix-time')

module.exports = {
  name: 'mysuggestions',
  module: 'suggestions',
  description: '👀 View your suggestions',
  isConfigurationCommand: false,
  runInteraction ( interaction) {
    getMemberSuggestions(interaction.member, suggestions => {
      if (Object.prototype.hasOwnProperty.call(suggestions, '0')) {
        const memberSuggestions = new MessageEmbed()
          .setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.user.displayAvatarURL() })
          .setColor('#2F3136')
          .setDescription(suggestions.map(suggestion => `:clock1: <t:${unixTime(suggestion.timestamp)}> - sID: ${suggestion.id}\n:pencil: ${suggestion.suggestion}`).join('\n\n'))
        interaction.editReply({ embeds: [memberSuggestions] })
      } else {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(guild.preferredLocale, 'MYSSUGESTIONS::NOSUGGESTIONS'))] })
      }
    })
  },
  runCommand ( message) {
    getMemberSuggestions(message.member, suggestions => {
      if (Object.prototype.hasOwnProperty.call(suggestions, '0')) {
        const memberSuggestions = new MessageEmbed()
          .setAuthor({ name: message.member.displayName, iconURL: message.member.user.displayAvatarURL() })
          .setColor('#2F3136')
          .setDescription(suggestions.map(suggestion => `:clock1: <t:${unixTime(suggestion.timestamp)}> - sID: ${suggestion.id}\n:pencil: ${suggestion.suggestion}`).join('\n\n'))
        message.reply({ embeds: [memberSuggestions] })
      } else {
        message.reply({ embeds: [plantillas.informacion(i18n(guild.preferredLocale, 'MYSSUGESTIONS::NOSUGGESTIONS'))] })
      }
    })
  }
}
