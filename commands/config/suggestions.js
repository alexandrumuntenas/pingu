const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { success } = require('../../functions/defaultMessages')
const { updateGuildConfigNext } = require('../../functions/guildDataManager')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'suggestions',
  module: 'suggestions',
  description: '⚙️ Configure the suggestions module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  interactionData: new SlashCommandBuilder()
    .addSubcommandGroup(scg => scg.setName('setchannel').setDescription('Configure the channels required in order to use the suggestions module')
      .addSubcommand(sc => sc.setName('review').setDescription('The channel where newly submitted suggestions will be reviewed')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where newly submitted suggestions will be reviewed').setRequired(true)))
      .addSubcommand(sc => sc.setName('approved').setDescription('The channel where approved suggestions will be announced')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where approved suggestions will be announced')))
      .addSubcommand(sc => sc.setName('denied').setDescription('The channel where denied suggestions will be announced')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where approved suggestions will be announced')))
      .addSubcommand(sc => sc.setName('reviewed').setDescription('The channel where reviewed suggestions will be announced')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where reviewed suggestions will be announced')))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'review': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { review: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:SUCCESS'))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { review: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:SUCCESS'))] })
          })
        }

        break
      }

      case 'approved': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { approved: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:SUCCESS'))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { approved: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:SUCCESS'))] })
          })
        }

        break
      }

      case 'denied': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { denied: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:SUCCESS'))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { denied: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:SUCCESS'))] })
          })
        }

        break
      }

      case 'reviewed': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { reviewed: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:SUCCESS'))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { reviewed: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:SUCCESS'))] })
          })
        }

        break
      }
    }
  },
  runCommand (locale, message) {

  }
}
