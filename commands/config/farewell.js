const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Status, Loader, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const guildMemberRemove = require('../../events/guildMemberRemove').execute

module.exports = {
  module: 'farewell',
  name: 'farewell',
  description: '⚙️ Configure the farewell settings for your server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('farewell')
    .setDescription('Configure the farewell settings for your server.')
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current farewell configuration'))
    .addSubcommand(subcommand => subcommand.setName('setchannel').setDescription('Set the farewell channel').addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setmessage').setDescription('Set the farewell message').addStringOption(option => option.setName('message').setDescription('The message to be sent. Avaliable placeholders: {member} {guild}').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('simulate').setDescription('Simulate the farewell message')),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const sentEmbed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.farewellChannel) || i18n(locale, 'UNSET')}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${interaction.database.farewellMessage || i18n(locale, 'UNSET')}`, true)

        interaction.editReply({ embeds: [sentEmbed] })
        break
      }
      case 'setchannel': {
        client.pool.query('UPDATE `guildData` SET `farewellChannel` = ? WHERE `guild` = ?', [interaction.options.getChannel('channel').id, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ content: i18n(locale, 'FAREWELL::SETCHANNEL:ERROR') })
          interaction.editReply({ embeds: [Success(i18n(locale, 'FAREWELL::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'setmessage': {
        client.pool.query('UPDATE `guildData` SET `farewellMessage` = ? WHERE `guild` = ?', [interaction.options.getString('message'), interaction.guild.id], (err) => {
          if (err) client.logError(err)
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
    const helpTray = Help('farewell', i18n(locale, 'FAREWELL::HELPTRAY:DESCRIPTION'), [{ option: 'viewconfig', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:VIEWCONFIG'), syntax: '', isNsfw: false }, { option: 'setchannel', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:SETCHANNEL'), syntax: '<#channel>', isNsfw: false }, { option: 'setmessage', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:SETMESSAGE'), syntax: '<message>', isNsfw: false }, { option: 'simulate', description: i18n(locale, 'FAREWELL::HELPTRAY:OPTION:SIMULATE'), syntax: '', isNsfw: false }])
    if (Object.prototype.hasOwnProperty.call(message.args, '0') && Object.prototype.hasOwnProperty.call(message.args, '1')) {
      switch (message.args[0]) {
        case 'viewconfig': {
          message.channel.send({ embeds: [Loader(i18n(locale, 'FETCHINGDATA'))] }).then((_message) => {
            const sentEmbed = new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:TITLE'))
              .setDescription(i18n(locale, 'FAREWELL::VIEWCONFIG:EMBED:DESCRIPTION'))
              .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.farewellChannel) || i18n(locale, 'UNSET')}`, true)
              .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${message.database.farewellMessage || i18n(locale, 'UNSET')}`, true)

            _message.edit({ embeds: [sentEmbed] })
          })
          break
        }
        case 'setchannel': {
          client.pool.query('UPDATE `guildData` SET `farewellChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'FAREWELL::SETCHANNEL:ERROR'))] })
            message.reply({ embeds: [Success(i18n(locale, 'FAREWELL::SETCHANNEL:SUCCESS', { CHANNEL: message.mentions.channels.first() }))] })
          })
          break
        }
        case 'setmessage': {
          const filter = m => m.member.id === message.member.id
          message.channel.send({ embeds: [Status(message, i18n(locale, 'FAREWELL::SETMESSAGE:ASKFORINPUT'))] })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            client.pool.query('UPDATE `guildData` SET `farewellMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) message.channel.send({ embeds: [Error(i18n(locale, 'FAREWELL::SETMESSAGE:ERROR'))] })
              message.channel.send({ embeds: [Success(i18n(locale, 'FAREWELL::SETMESSAGE:SUCCESS', { MESSAGE: collected.first().content }))] })
            })
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
    } else {
      message.reply({ embeds: [helpTray] })
    }
  }
}
