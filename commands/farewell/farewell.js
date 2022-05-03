const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { plantillas } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')
const { actualizarConfiguracionDelServidor } = require('../../functions/guildManager')
const { ChannelType } = require('discord-api-types/v9')

module.exports = {
  module: 'farewell',
  name: 'farewell',
  description: '⚙️ Configure the farewell settings for your server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1000,
  isConfigurationCommand: true,
  interaction: new SlashCommandBuilder()
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current farewell configuration'))
    .addSubcommand(subcommand => subcommand.setName('setchannel').setDescription('Set the farewell channel').addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true).addChannelTypes([ChannelType.GuildText, ChannelType.GuildNews])))
    .addSubcommand(subcommand => subcommand.setName('setmessage').setDescription('Set the farewell message').addStringOption(option => option.setName('message').setDescription('The message to be sent. Avaliable placeholders: {member} {guild}').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('simulate').setDescription('Simulate the farewell message')),
  runInteraction (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const farewellBasicConfig = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(interaction.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:TITLE'))
          .setDescription(i18n(interaction.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:DESCRIPTION'))
          .addField(`<:blurple_chat:892441341827616859> ${i18n(interaction.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:CHANNEL')}`, interaction.guild.configuration.farewell.channel ? `<#${interaction.guild.configuration.farewell.channel}>` : i18n(interaction.guild.preferredLocale, 'NOSET'))
          .addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(interaction.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:MESSAGE')}`, interaction.guild.configuration.farewell.message ? interaction.guild.configuration.farewell.message : i18n(interaction.guild.preferredLocale, 'NOSET'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        interaction.editReply({ embeds: [farewellBasicConfig] })
        break
      }

      case 'setchannel': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'farewell', newconfig: { channel: interaction.options.getChannel('channel').id } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'FAREWELL::SETCHANNEL:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredLocale, 'FAREWELL::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }

      case 'setmessage': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'farewell', newconfig: { message: interaction.options.getString('message') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'FAREWELL::SETMESSAGE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredLocale, 'FAREWELL::SETMESSAGE:SUCCESS', { MESSAGE: interaction.options.getString('message') }))] })
        })
        break
      }

      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(interaction.guild.preferredLocale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  },
  runCommand (message) {
    function sendHelp () {
      message.reply({
        embeds: plantillas.ayuda({
          name: 'farewell',
          description: i18n(message.guild.preferredLocale, 'FAREWELL::HELP:DESCRIPTION'),
          cooldown: 1,
          module: 'farewell',
          subcommands: [
            { name: 'viewconfig', description: i18n(message.guild.preferredLocale, 'FAREWELL::HELP:VIEWCONFIG:DESCRIPTION') },
            { name: 'setchannel', description: i18n(message.guild.preferredLocale, 'FAREWELL::HELP:SETCHANNEL:DESCRIPTION'), parameters: '<channel>' },
            { name: 'setmessage', description: i18n(message.guild.preferredLocale, 'FAREWELL::HELP:SETMESSAGE:DESCRIPTION'), parameters: '<message>' }
          ]
        })
      })
    }

    if (!Object.prototype.hasOwnProperty.call(message.parameters, 0)) return sendHelp()
    switch (message.parameters[0]) {
      case 'viewconfig': {
        const farewellBasicConfig = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(message.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:TITLE'))
          .setDescription(i18n(message.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:DESCRIPTION'))
          .addField(`<:blurple_chat:892441341827616859> ${i18n(message.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:CHANNEL')}`, message.guild.configuration.farewell.channel ? `<#${message.guild.configuration.farewell.channel}>` : i18n(message.guild.preferredLocale, 'NOSET'))
          .addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(message.guild.preferredLocale, 'FAREWELL::VIEWCONFIG:MESSAGE')}`, message.guild.configuration.farewell.message ? message.guild.configuration.farewell.message : i18n(message.guild.preferredLocale, 'NOSET'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        message.reply({ embeds: [farewellBasicConfig] })
        break
      }

      case 'setchannel': {
        if (!message.mentions.channels.first()) return sendHelp()
        actualizarConfiguracionDelServidor(message.guild, { column: 'farewell', newconfig: { channel: message.mentions.channels.first().id } }, err => {
          if (err) return message.reply({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'FAREWELL::SETCHANNEL:ERROR'))] })
          return message.reply({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'FAREWELL::SETCHANNEL:SUCCESS', { CHANNEL: message.mentions.channels.first() }))] })
        })
        break
      }

      case 'setmessage': {
        if (!Object.prototype.hasOwnProperty.call(message.parameters, 1)) return sendHelp()
        actualizarConfiguracionDelServidor(message.guild, { column: 'farewell', newconfig: { message: message.parameters.slice(1).join(' ') } }, err => {
          if (err) return message.reply({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'FAREWELL::SETMESSAGE:ERROR'))] })
          return message.reply({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'FAREWELL::SETMESSAGE:SUCCESS', { MESSAGE: message.parameters.slice(1).join(' ') }))] })
        })

        break
      }

      default: {
        sendHelp()
        break
      }
    }
  }
}
