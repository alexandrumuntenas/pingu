const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Status, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const guildMemberRemove = require('../../events/guildMemberRemove').execute
const { updateGuildConfig } = require('../../modules/guildDataManager.js')

module.exports = {
  module: 'farewell',
  name: 'farewell',
  description: '⚙️ Configure the farewell settings for your server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current farewell configuration'))
    .addSubcommand(subcommand => subcommand.setName('setchannel').setDescription('Set the farewell channel').addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setmessage').setDescription('Set the farewell message').addStringOption(option => option.setName('message').setDescription('The message to be sent. Avaliable placeholders: {member} {guild}').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('simulate').setDescription('Simulate the farewell message')),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const configStatus = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.farewellChannel) || i18n(locale, 'UNSET')}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${interaction.database.farewellMessage || i18n(locale, 'UNSET')}`, true)

        interaction.editReply({ embeds: [configStatus] })
        break
      }
      case 'setchannel': {
        updateGuildConfig(client, interaction.guild, { column: 'farewellChannel', value: interaction.options.getChannel('channel') }, (err) => {
          if (err) return interaction.editReply({ content: i18n(locale, 'FAREWELL::SETCHANNEL:ERROR') })
          interaction.editReply({ embeds: [Success(i18n(locale, 'FAREWELL::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'setmessage': {
        updateGuildConfig(client, interaction.guild, { column: 'farewellMessage', value: interaction.options.getString('message') }, (err) => {
          if (err) return interaction.editReply({ content: i18n(locale, 'FAREWELL::SETMESSAGE:ERROR') })
          interaction.editReply({ embeds: [Success(i18n(locale, 'FAREWELL::SETMESSAGE:SUCCESS', { MESSAGE: interaction.options.getString('message') }))] })
        })
        break
      }
      case 'simulate': {
        interaction.editReply({ embeds: [Status(i18n(locale, 'FAREWELL::SIMULATE:SENDING'))] })
        guildMemberRemove(client, interaction.member)
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('farewell', i18n(locale, 'FAREWELL::HELPTRAY:DESCRIPTION'), [{ option: 'viewconfig', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:VIEWCONFIG'), syntax: '' }, { option: 'setchannel', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:SETCHANNEL'), syntax: '<#channel>' }, { option: 'setmessage', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:SETMESSAGE'), syntax: '<message>' }, { option: 'simulate', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:SIMULATE'), syntax: '' }])
    if (!(message.args && Object.prototype.hasOwnProperty.call(message.args, 0) && Object.prototype.hasOwnProperty.call(message.args, 1))) return message.reply({ embeds: [helpTray] })
    switch (message.args[0]) {
      case 'viewconfig': {
        const configStatus = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.farewellChannel) || i18n(locale, 'UNSET')}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${message.database.farewellMessage || i18n(locale, 'UNSET')}`, true)
        message.reply({ embeds: [configStatus] })
        break
      }
      case 'setchannel': {
        updateGuildConfig(client, message.guild, { column: 'farewellChannel', value: message.mentions.channels.first().id }, (err) => {
          if (err) return message.reply({ content: i18n(locale, 'FAREWELL::SETCHANNEL:ERROR') })
          message.reply({ embeds: [Success(i18n(locale, 'FAREWELL::SETCHANNEL:SUCCESS', { CHANNEL: message.mentions.channels.first() }))] })
        })
        break
      }
      case 'setmessage': {
        updateGuildConfig(client, message.guild, { column: 'farewellMessage', value: message.content.replace(`${message.database.guildPrefix}farewell setmessage `, '') }, (err) => {
          if (err) message.reply({ embeds: [Error(i18n(locale, 'FAREWELL::SETMESSAGE:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'FAREWELL::SETMESSAGE:SUCCESS', { MESSAGE: message.content.replace(`${message.database.guildPrefix}farewell setmessage `, '') }))] })
        })
        break
      }
      case 'simulate': {
        message.reply({ embeds: [Status(i18n(locale, 'FAREWELL::SIMULATE:SENDING'))] })
        guildMemberRemove(client, message.member)
        break
      }
      default: {
        message.reply({ embeds: [helpTray] })
        break
      }
    }
  }
}
