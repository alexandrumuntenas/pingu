const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { ChannelType } = require('discord-api-types/v9')
const { updateGuildConfig } = require('../../functions/guildDataManager')
const { plantillas } = require('../../functions/messageManager')
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
    .addSubcommand(sc => sc.setName('setcooldown').setDescription('Set the cooldown between suggestions').addIntegerOption(input => input.setName('cooldown').setDescription('Set the cooldown between suggestions'))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'dmupdates': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { dmupdates: interaction.options.getBoolean('enable') } }, (err) => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'SUGGESTIONS::DMUPDATES:ERROR'))] })
          if (interaction.options.getBoolean('enable')) interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'SUGGESTIONS::DMUPDATES:ENABLED'))] })
          else interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'SUGGESTIONS::DMUPDATES:DISABLED'))] })
        })
        break
      }
      case 'setlogs': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { logs: interaction.options.getChannel('channel').id } }, (err) => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'SUGGESTIONS::SETLOGS:ERROR'))] })
          interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'SUGGESTIONS::SETLOGS:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'setchannel': {
        updateGuildConfig(interaction.guild, { column: 'suggestions', newconfig: { channel: interaction.options.getChannel('channel').id } }, (err) => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'SUGGESTIONS::SETCHANNEL:ERROR'))] })
          interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'SUGGESTIONS::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(locale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}
