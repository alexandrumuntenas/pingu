const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { approveSuggestion, rejectSuggestion, addNoteToSuggestion } = require('../../modules/suggestions')
const { error, success, info } = require('../../functions/messageManager')

module.exports = {
  name: 'suggestion',
  module: 'suggestions',
  description: '📖 Manage the suggestions',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('approve').setDescription('Approve a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID').setRequired(true)))
    .addSubcommand(sc => sc.setName('reject').setDescription('Reject a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID').setRequired(true)))
    .addSubcommand(sc => sc.setName('addnote').setDescription('Add a note to a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID').setRequired(true)).addStringOption(input => input.setName('note').setDescription('The note to add').setRequired(true))),
  // .addSubcommand(sc => sc.setName('blacklist').setDescription('Blacklist a user').addUserOption(input => input.setName('user').setDescription('The user to blacklist')).addStringOption(input => input.setName('reason').setDescription('The reason for blacklisting the user'))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'approve': {
        approveSuggestion(interaction.member, interaction.options.getString('suggestion'), err => {
          if (err) return interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTION::APPROVE:ERROR'))] })
          return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTION::APPROVE:SUCCESS', { SUGGESTIONID: interaction.options.getString('suggestion') }))] })
        })
        break
      }
      case 'reject': {
        rejectSuggestion(interaction.member, interaction.options.getString('suggestion'), err => {
          if (err) return interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTION::REJECT:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTION::REJECT:SUCCESS', { SUGGESTIONID: interaction.options.getString('suggestion') }))] })
        })
        break
      }
      case 'addnote': {
        addNoteToSuggestion(interaction.member, interaction.options.getString('suggestion'), interaction.options.getString('note'), err => {
          if (err) return interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTION::ADDNOTE:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTION::ADDNOTE:SUCCESS', { SUGGESTIONID: interaction.options.getString('suggestion') }))] })
        })
        break
      }
      /* case 'blacklist': {
        break
      } */
      default: {
        interaction.editReply({ embeds: [info(i18n(locale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}
