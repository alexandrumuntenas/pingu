const { Permissions, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Status, Help, Error, Loader } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const { isInteger } = require('mathjs')
const updateGuildConfig = require('../../functions/updateGuildConfig')
const isHexColor = require('is-hexcolor')

const channelRelationship = { 0: 'Not Setup', 1: 'Same Channel where Message is Sent' }
const emojiRelationship = { 0: '<:discord_offline:876102753821278238>', 1: '<:discord_online:876102925129236481>' }

module.exports = {
  module: 'levels',
  name: 'levels',
  description: '⚙️ Configure the levels system',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('levels')
    .setDescription('Configure the levels system')
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current levels system configuration'))
    .addSubcommand(subcommand => subcommand.setName('setrankupchannel').setDescription('Set the rankUp channel').addStringOption(option =>
      option.setName('channel')
        .setDescription('Set the new channel')
        .addChoice('Disabled', 'disabled')
        .addChoice('Same Channel Where Message Is Sent', 'same')
        .addChoice('This Channel', 'this').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setrankupmessage').setDescription('Set the Rank Up message').addStringOption(option => option.setName('message').setDescription('The message to be sent. Avaliable placeholders: {member} {oldlevel} {newlevel} {experience}').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setdifficulty').setDescription('Change the difficulty to level up').addNumberOption(option => option.setName('difficulty').setDescription('Enter a number 1-5').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setbackground').setDescription('Set the rank cards background').addStringOption(option => option.setName('url').setDescription('Enter a valid image URL').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('overlaycolor').setDescription('Set the rank cards overlay color').addStringOption(option => option.setName('hexcolor').setDescription('Enter a hex color').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('overlayopacity').setDescription('Set the rank cards overlay opacity').addNumberOption(option => option.setName('opacity').setDescription('Enter a number').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const sentEmbed = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(locale, 'LEVELS::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(i18n(locale, 'LEVELS::VIEWCONFIG:EMBED:DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.levelsChannel) || channelRelationship[interaction.database.levelsChannel]}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${interaction.database.levelsMessage || i18n(locale, 'UNSET')}`, true)
          .addField(`:trophy: ${i18n(locale, 'DIFFICULTY')}`, `${interaction.database.levelsDifficulty}`, true)
          .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'LEVELS::VIEWCONFIG:EMBED:RANKCARD')}`, `${i18n(locale, 'STATUS')}: ${emojiRelationship[1]}\n${i18n(locale, 'BACKGROUND')}: [Ver imagen](${interaction.database.levelsImageCustomBackground})\n${i18n(locale, 'OVERLAYCOLOR')}: ${interaction.database.levelsImageCustomOverlayColor}\n${i18n(locale, 'OVERLAYOPACITY')}: ${interaction.database.levelsImageCustomOpacity}`, false)

        interaction.editReply({ embeds: [sentEmbed] })
        break
      }
      case 'setrankupchannel': {
        switch (interaction.options.getString('channel')) {
          case 'disable': {
            updateGuildConfig(client, interaction.guild, { column: 'levelsChannel', value: 0 }, (err) => {
              if (err) return interaction.editReply(Error(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:ERROR')))
              interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:SUCCESS', { CHANNEL: channelRelationship[0] }))] })
            })
            break
          }
          case 'same': {
            updateGuildConfig(client, interaction.guild, { column: 'levelsChannel', value: 1 }, (err) => {
              if (err) return interaction.editReply(Error(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:ERROR')))
              interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:SUCCESS', { CHANNEL: channelRelationship[1] }))] })
            })
            break
          }
          case 'this': {
            updateGuildConfig(client, interaction.guild, { column: 'levelsChannel', value: interaction.channel.id }, (err) => {
              if (err) return interaction.editReply(Error(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:ERROR')))
              interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:SUCCESS', { CHANNEL: interaction.channel }))] })
            })
            break
          }
          default: {
            interaction.editReply({ embeds: [Status(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:NOARGS', { CHANNEL: interaction.database.levelsChannel }))] })
            break
          }
        }
        break
      }
      case 'setrankupmessage': {
        updateGuildConfig(client, interaction.guild, { column: 'levelsMessage', value: interaction.options.getString('message') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'LEVELS::SETRANKUPMESSAGE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPMESSAGE:SUCCESS', { MESSAGE: `\`${interaction.options.getString('message')}\`` }))] })
        })
        break
      }
      case 'setdifficulty': {
        updateGuildConfig(client, interaction.guild, { column: 'levelsDifficulty', value: parseInt(interaction.options.getNumber('difficulty')) }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'LEVELS::SETDIFFICULTY:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::SETDIFFICULTY:SUCCESS', { DIFFICULTY: interaction.options.getNumber('difficulty') }))] })
        })
        break
      }
      case 'setbackground': {
        updateGuildConfig(client, interaction.guild, { column: 'levelsImageCustomBackground', value: interaction.options.getString('url') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'LEVELS::SETBACKGROUND:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::SETBACKGROUND:SUCCESS', { BACKGROUND: interaction.options.getString('url') }))] })
        })
        break
      }
      case 'overlayopacity': {
        updateGuildConfig(client, interaction.guild, { column: 'levelsImageCustomOpacity', value: interaction.options.getNumber('opacity') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'LEVELS::OVERLAYOPACITY:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::OVERLAYOPACITY:SUCCESS', { OPACITY: interaction.options.getNumber('opacity') }))] })
        })
        break
      }
      case 'overlaycolor': {
        let hexcolor = interaction.options.getString('hexcolor')
        if (!hexcolor.startsWith('#')) hexcolor = `#${hexcolor}`
        if (isHexColor(hexcolor)) {
          updateGuildConfig(client, interaction.guild, { column: 'levelsImageCustomOverlayColor', value: hexcolor }, (err) => {
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'LEVELS::OVERLAYCOLOR:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'LEVELS::OVERLAYCOLOR:SUCCESS', { COLOR: hexcolor }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'LEVELS::OVERLAYCOLOR:NOTHEX'))] })
        }
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('levels', i18n(locale, 'LEVELS::HELPTRAY:DESCRIPTION'), [{ option: 'viewconfig', description: i18n(locale, 'LEVELS::HELPTRAY:OPTION:VIEWCONFIG') }, { option: 'setrankupmessage', description: i18n(locale, 'LEVELS::HELPTRAY:OPTION:SETRANKUPMESSAGE') }, { option: 'setrankupchannel', description: i18n(locale, 'LEVELS::HELPTRAY:OPTION:SETRANKUPCHANNEL') }, { option: 'setdifficulty', description: i18n(locale, 'LEVELS::HELPTRAY:OPTION:SETDIFFICULTY'), syntax: 'setdifficulty <number of difficulty>' }, { option: 'setbackground', description: i18n(locale, 'LEVELS::HELPTRAY:OPTION:SETBACKGROUND'), syntax: 'setbackground <background url>' }, { option: 'overlayopacity', description: i18n(locale, 'LEVELS::HELPTRAY:OPTION:OVERLAYOPACITY'), syntax: 'overlayopacity <opacity>' }, { option: 'overlaycolor', description: i18n(locale, 'LEVELS::HELPTRAY:OPTION:OVERLAYCOLOR'), syntax: 'overlaycolor <hex code>' }])
    if (!(message.args && Object.prototype.hasOwnProperty.call(message.args, 0))) return message.reply({ embeds: [helpTray] })
    switch (message.args[0]) {
      case 'viewconfig': {
        message.channel.send({ embeds: [Loader(i18n(locale, 'FETCHINGDATA'))] }).then((_message) => {
          const configStatus = new MessageEmbed()
            .setColor('#2F3136')
            .setTitle(i18n(locale, 'LEVELS::VIEWCONFIG:EMBED:TITLE'))
            .setDescription(i18n(locale, 'LEVELS::VIEWCONFIG:EMBED:DESCRIPTION'))
            .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.levelsChannel) || channelRelationship[message.database.levelsChannel]}`, true)
            .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${message.database.levelsMessage || i18n(locale, 'UNSET')}`, true)
            .addField(`:trophy: ${i18n(locale, 'DIFFICULTY')}`, `${message.database.levelsDifficulty}`, true)
            .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'LEVELS::VIEWCONFIG:EMBED:RANKCARD')}`, `${i18n(locale, 'STATUS')}: ${emojiRelationship[1]}\n${i18n(locale, 'BACKGROUND')}: [Ver imagen](${message.database.levelsImageCustomBackground})\n${i18n(locale, 'OVERLAYCOLOR')}: ${message.database.levelsImageCustomOverlayColor}\n${i18n(locale, 'OVERLAYOPACITY')}: ${message.database.levelsImageCustomOpacity}`, false)

          _message.edit({ embeds: [configStatus] })
        })
        break
      }
      case 'setrankupchannel': {
        if (message.mentions.channels.first()) {
          updateGuildConfig(client, message.guild, { column: 'levelsChannel', value: message.mentions.channels.first().id }, (err) => {
            if (err) return message.reply(Error(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:ERROR')))
            message.reply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:SUCCESS', { CHANNEL: message.mentions.channels.first() }))] })
          })
        } else {
          if (!Object.prototype.hasOwnProperty.call(message.args, 1)) return message.reply({ embeds: [helpTray] })
          switch (message.args[1]) {
            case 'none': {
              updateGuildConfig(client, message.guild, { column: 'levelsChannel', value: 0 }, (err) => {
                if (err) return message.reply(Error(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:ERROR')))
                message.reply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:SUCCESS', { CHANNEL: channelRelationship[0] }))] })
              })
              break
            }
            case 'same': {
              updateGuildConfig(client, message.guild, { column: 'levelsChannel', value: 1 }, (err) => {
                if (err) return message.reply(Error(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:ERROR')))
                message.reply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPCHANNEL:SUCCESS', { CHANNEL: channelRelationship[1] }))] })
              })
              break
            }
            default: {
              message.reply({ embeds: [helpTray] })
              break
            }
          }
        }
        break
      }
      case 'setrankupmessage': {
        updateGuildConfig(client, message.guild, { column: 'levelsMessage', value: message.content.replace(`${message.database.guildPrefix}levels setrankupmessage `, '') }, (err) => {
          if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'LEVELS::SETRANKUPMESSAGE:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'LEVELS::SETRANKUPMESSAGE:SUCCESS', { MESSAGE: message.content.replace(`${message.database.guildPrefix}levels setrankupmessage `, '') }))] })
        })
        break
      }
      case 'setdifficulty': {
        if (!Object.prototype.hasOwnProperty.call(message.args, 1)) return message.reply({ embeds: [helpTray] })
        if (isInteger(parseInt(message.args[1]))) {
          updateGuildConfig(client, message.guild, { column: 'levelsDifficulty', value: parseInt(parseInt(message.args[1])) }, (err) => {
            if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'LEVELS::SETDIFFICULTY:ERROR'))] })
            message.reply({ embeds: [Success(i18n(locale, 'LEVELS::SETDIFFICULTY:SUCCESS', { DIFFICULTY: parseInt(message.args[1]) }))] })
          })
        } else {
          message.reply({ embeds: [Error(i18n(locale, 'LEVELS::SETDIFFICULTY:NOTINT'))] })
        }
        break
      }
      case 'setbackground': {
        if (!Object.prototype.hasOwnProperty.call(message.args, 1)) return message.reply({ embeds: [helpTray] })
        updateGuildConfig(client, message.guild, { column: 'levelsImageCustomBackground', value: message.args[1] }, (err) => {
          if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'LEVELS::SETBACKGROUND:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'LEVELS::SETBACKGROUND:SUCCESS', { BACKGROUND: message.args[1] }))] })
        })
        break
      }
      case 'overlayopacity': {
        if (!Object.prototype.hasOwnProperty.call(message.args, 1)) return message.reply({ embeds: [helpTray] })
        updateGuildConfig(client, message.guild, { column: 'levelsImageCustomOpacity', value: message.args[1] }, (err) => {
          if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'LEVELS::OVERLAYOPACITY:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'LEVELS::OVERLAYOPACITY:SUCCESS', { OPACITY: message.args[1] }))] })
        })
        break
      }
      case 'overlaycolor': {
        if (!Object.prototype.hasOwnProperty.call(message.args, 1)) return message.reply({ embeds: [helpTray] })
        let hexcolor = message.args[1]
        if (!hexcolor.startsWith('#')) hexcolor = `#${hexcolor}`
        if (isHexColor(hexcolor)) {
          updateGuildConfig(client, message.guild, { column: 'levelsImageCustomOverlayColor', value: hexcolor }, (err) => {
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'LEVELS::OVERLAYCOLOR:ERROR'))] })
            message.reply({ embeds: [Success(i18n(locale, 'LEVELS::OVERLAYCOLOR:SUCCESS', { COLOR: hexcolor }))] })
          })
        } else {
          message.reply({ embeds: [Status(i18n(locale, 'LEVELS::OVERLAYCOLOR:NOTHEX'))] })
        }
        break
      }
      default: {
        message.reply({ embeds: [helpTray] })
        break
      }
    }
  }
}
