const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { ChannelType } = require('discord-api-types/v9')
const { updateGuildConfig } = require('../../functions/guildDataManager')
const { success, info, error } = require('../../functions/defaultMessages')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'suggestions',
  module: 'suggestions',
  cooldown: 1000,
  description: '⚙️ Configure the suggestions module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('dmupdates').setDescription('Send suggestion status updates to it\'s author?').addBooleanOption(input => input.setName('enable').setDescription('Send suggestion status updates to it\'s author?').setRequired(true)))
    .addSubcommand(sc => sc.setName('setlogs').setDescription('Set the channel where the bot will send the suggestion logs').addChannelOption(input => input.setName('channel').setDescription('Set the channel where the bot will send the suggestion logs').addChannelType(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sc => sc.setName('setchannel').setDescription('Set the channel where the bot will send the suggestions').addChannelOption(input => input.setName('channel').setDescription('Set the channel where the bot will send the suggestions').addChannelType(ChannelType.GuildText).setRequired(true)))
    .addSubcommand(sc => sc.setName('setreviewer').setDescription('Set the role that can review suggestions').addRoleOption(input => input.setName('role').setDescription('Set the role that can review suggestions')))
    .addSubcommand(sc => sc.setName('setcooldown').setDescription('Set the cooldown between suggestions').addIntegerOption(input => input.setName('cooldown').setDescription('Set the cooldown between suggestions')))
    .addSubcommand(sc => sc.setName('communityafter').setDescription('After sending the suggestion to the staff, make the community review it.').addBooleanOption(input => input.setName('enable').setDescription('After sending the suggestion to the staff, make the community review it.').setRequired(true)))
    .addSubcommand(sc => sc.setName('votingtimelimit').setDescription('Set the time limit for the voting phase').addIntegerOption(input => input.setName('time').setDescription('Set the time limit for the voting phase in minutes').setRequired(true)))
    .addSubcommand(sc => sc.setName('setvotingchannel').setDescription('Set the channel where the bot will send the voting results').addChannelOption(input => input.setName('channel').setDescription('Set the channel where the bot will send the voting results').addChannelType(ChannelType.GuildText).setRequired(true))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'dmupdates': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { dmupdates: interaction.options.getBoolean('enable') } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::DMUPDATES:ERROR'))] })
          if (interaction.options.getBoolean('enable')) interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::DMUPDATES:ENABLED'))] })
          else interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::DMUPDATES:DISABLED'))] })
        })
        break
      }
      case 'setlogs': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { logs: interaction.options.getChannel('channel').id } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::SETLOGS:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETLOGS:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'setchannel': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { channel: interaction.options.getChannel('channel').id } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::SETCHANNEL:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'setreviewer': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { reviewer: interaction.options.getRole('role').id } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::SETREVIEWER:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETREVIEWER:SUCCESS', { ROLE: interaction.options.getRole('role') }))] })
        })
        break
      }
      case 'setcooldown': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { cooldown: interaction.options.getInteger('cooldown') } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::SETCOOLDOWN:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETCOOLDOWN:SUCCESS', { COOLDOWN: interaction.options.getInteger('cooldown') }))] })
        })
        break
      }
      /*
      case 'communitybefore': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { communitybefore: interaction.options.getBoolean('enable') } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::COMMUNITYBEFORE:ERROR'))] })
          if (interaction.options.getBoolean('enable')) interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::COMMUNITYBEFORE:ENABLED'))] })
          else interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::COMMUNITYBEFORE:DISABLED'))] })
        })
        break
      }
      */
      case 'communityafter': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { communityafter: interaction.options.getBoolean('enable') } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::COMMUNITYAFTER:ERROR'))] })
          if (interaction.options.getBoolean('enable')) interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::COMMUNITYAFTER:ENABLED'))] })
          else interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::COMMUNITYAFTER:DISABLED'))] })
        })
        break
      }
      case 'votingtimelimit': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { voting: { timelimit: interaction.options.getInteger('time') } } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::VOTINGTIMELIMIT:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::VOTINGTIMELIMIT:SUCCESS', { TIME: interaction.options.getInteger('time') }))] })
        })
        break
      }
      case 'setvotingchannel': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { voting: { channel: interaction.options.getChannel('channel').id } } }, (err) => {
          if (err) interaction.editReply({ embeds: [error(i18n(locale, 'SUGGESTIONS::SETVOTINGCHANNEL:ERROR'))] })
          interaction.editReply({ embeds: [success(i18n(locale, 'SUGGESTIONS::SETVOTINGCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      default: {
        interaction.editReply({ embeds: [info(i18n(locale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}
