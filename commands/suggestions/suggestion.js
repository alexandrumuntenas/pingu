const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionsBitField } = require('discord.js')
const { approveSuggestion, rejectSuggestion, addNoteToSuggestion, addUserToBlacklist, removeUserFromBlacklist } = require('../../modules/suggestions')
const { plantillas } = require('../../core/messageManager')

const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'suggestion',
  module: 'suggestions',
  description: '📖 Manage the suggestions',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  isConfigurationCommand: false,
  interaction: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('approve').setDescription('Approve a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID').setRequired(true)))
    .addSubcommand(sc => sc.setName('reject').setDescription('Reject a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID').setRequired(true)))
    .addSubcommand(sc => sc.setName('addnote').setDescription('Add a note to a suggestion').addStringOption(input => input.setName('suggestion').setDescription('The suggestion or the message ID').setRequired(true)).addStringOption(input => input.setName('note').setDescription('The note to add').setRequired(true)))
    .addSubcommand(sc => sc.setName('blacklist').setDescription('Blacklist a user').addUserOption(input => input.setName('user').setDescription('The user to blacklist').setRequired(true)))
    .addSubcommand(sc => sc.setName('unblacklist').setDescription('Blacklist a user').addUserOption(input => input.setName('user').setDescription('The user to unblacklist').setRequired(true))),
  runInteraction (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'approve': {
        approveSuggestion(interaction.member, interaction.options.getString('suggestion'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::APPROVE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::APPROVE:SUCCESS', { SUGGESTIONID: interaction.options.getString('suggestion') }))] })
        })
        break
      }
      case 'reject': {
        rejectSuggestion(interaction.member, interaction.options.getString('suggestion'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::REJECT:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::REJECT:SUCCESS', { SUGGESTIONID: interaction.options.getString('suggestion') }))] })
        })
        break
      }
      case 'addnote': {
        addNoteToSuggestion(interaction.member, interaction.options.getString('suggestion'), interaction.options.getString('note'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::ADDNOTE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::ADDNOTE:SUCCESS', { SUGGESTIONID: interaction.options.getString('suggestion') }))] })
        })
        break
      }
      case 'blacklist': {
        addUserToBlacklist(interaction.guild, interaction.options.getUser('user'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::BLACKLIST:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::BLACKLIST:SUCCESS', { USER: interaction.options.getUser('user').tag }))] })
        })
        break
      }
      case 'unblacklist': {
        removeUserFromBlacklist(interaction.guild, interaction.options.getUser('user'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::UNBLACKLIST:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n.getTranslation(interaction.guild.preferredLocale, 'SUGGESTION::UNBLACKLIST:SUCCESS', { USER: interaction.options.getUser('user').tag }))] })
        })
        break
      }
      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n.getTranslation(interaction.guild.preferredLocale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}
