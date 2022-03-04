const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { success } = require('../../functions/defaultMessages')
const { updateGuildConfigNext } = require('../../functions/guildDataManager')
const i18n = require('../../i18n/i18n')
const { ChannelType } = require('discord-api-types/v9')

module.exports = {
  name: 'suggestions',
  module: 'suggestions',
  description: '⚙️ Configure the suggestions module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: true,
  interactionData: new SlashCommandBuilder()
    .addSubcommandGroup(scg => scg.setName('setchannel').setDescription('Configure the channels required in order to use the suggestions module')
      .addSubcommand(sc => sc.setName('review').setDescription('The channel where newly submitted suggestions will be reviewed')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where newly submitted suggestions will be reviewed').setRequired(true).addChannelTypes([ChannelType.GuildText, ChannelType.GuildNews])))
      .addSubcommand(sc => sc.setName('approved').setDescription('The channel where approved suggestions will be announced')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where approved suggestions will be announced').addChannelTypes([ChannelType.GuildText, ChannelType.GuildNews])))
      .addSubcommand(sc => sc.setName('denied').setDescription('The channel where denied suggestions will be announced')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where approved suggestions will be announced').addChannelTypes([ChannelType.GuildText, ChannelType.GuildNews])))
      .addSubcommand(sc => sc.setName('reviewed').setDescription('The channel where reviewed suggestions will be announced')
        .addChannelOption(input => input.setName('channel').setDescription('The channel where reviewed suggestions will be announced')))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'review': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { review: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { review: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEW:SUCCESS', { CHANNEL: i18n(locale, 'UNSET') }))] })
          })
        }

        break
      }

      case 'approved': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { approved: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { approved: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:APPROVED:SUCCESS', { CHANNEL: i18n(locale, 'UNSET') }))] })
          })
        }

        break
      }

      case 'denied': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { denied: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { denied: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:DENIED:SUCCESS', { CHANNEL: i18n(locale, 'UNSET') }))] })
          })
        }

        break
      }

      case 'reviewed': {
        if (interaction.options.getChannel('channel')) {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { reviewed: interaction.options.getChannel('channel').id } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
          })
        } else {
          updateGuildConfigNext(interaction.guild, { column: 'suggestions', newconfig: { channel: { reviewed: null } } }, err => {
            if (err) return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:ERROR'))] })
            return interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:REVIEWED:SUCCESS', { CHANNEL: i18n(locale, 'UNSET') }))] })
          })
        }

        break
      }
    }
  }
}
