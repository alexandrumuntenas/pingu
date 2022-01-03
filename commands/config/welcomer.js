const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { welcomeCard } = require('../../modules/canvasProcessing')
const { Success, Status, Help, Loader } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const tempFileRemover = require('../../functions/tempFileRemover')
const guildMemberAdd = require('../../events/guildMemberAdd').execute
const isHexcolor = require('is-hexcolor')
const { SlashCommandBuilder } = require('@discordjs/builders')

const emojiRelationship = { 0: '<:discord_offline:876102753821278238>', 1: '<:discord_online:876102925129236481>' }

module.exports = {
  module: 'welcome',
  name: 'welcomer',
  description: '⚙️ Configure the welcomer module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('welcomer')
    .setDescription('Configure the welcomer module')
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current welcomer configuration'))
    .addSubcommand(subcommand => subcommand.setName('setchannel').setDescription('Set the welcomer channel').addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setmessage').setDescription('Set the welcomer message').addStringOption(option => option.setName('message').setDescription('The message to be sent. Avaliable placeholders: {member} {guild}').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('enablecards').setDescription('Enable the welcomer cards'))
    .addSubcommand(subcommand => subcommand.setName('disablecards').setDescription('Disable the welcomer cards'))
    .addSubcommand(subcommand => subcommand.setName('setbackground').setDescription('Set the welcomer cards background').addStringOption(option => option.setName('url').setDescription('Enter a valid image URL').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('overlaycolor').setDescription('Set the welcomer cards overlay color').addStringOption(option => option.setName('hexcolor').setDescription('Enter a hex color').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('overlayopacity').setDescription('Set the welcomer cards overlay opacity').addNumberOption(option => option.setName('opacity').setDescription('Enter a number').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('overlayblur').setDescription('Set the welcomer cards overlay blur').addNumberOption(option => option.setName('blur').setDescription('Enter a number').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('roundavatar').setDescription('Set the welcomer cards round avatar').addBooleanOption(option => option.setName('value').setDescription('Select a value').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('test').setDescription('Test the welcomer message'))
    .addSubcommand(subcommand => subcommand.setName('simulate').setDescription('Simulate the welcomer message')),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const sentEmbed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.welcomeChannel) || i18n(locale, 'UNSET')}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${interaction.database.welcomeMessage || i18n(locale, 'UNSET')}`, true)
          .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS')}`, `${i18n(locale, 'STATUS')}: ${emojiRelationship[interaction.database.welcomeImage]}\n${i18n(locale, 'BACKGROUND')} [Ver imagen](${interaction.database.welcomeImageCustomBackground})\n${i18n(locale, 'OVERLAYCOLOR')}: ${interaction.database.welcomeImageCustomOverlayColor}\n${i18n(locale, 'OVERLAYBLUR')}: ${interaction.database.welcomeImageCustomBlur}\n${i18n(locale, 'OVERLAYOPACITY')}: ${interaction.database.welcomeImageCustomOpacity}\n${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS:ROUNDAVATAR')}: ${emojiRelationship[interaction.database.welcomeImageRoundAvatar]}`, false)

        interaction.editReply({ embeds: [sentEmbed] })
        break
      }
      case 'setchannel': {
        client.pool.query('UPDATE `guildData` SET `welcomeChannel` = ? WHERE `guild` = ?', [interaction.options.getChannel('welcomechannel').id, interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::SETCHANNEL:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'setmessage': {
        client.pool.query('UPDATE `guildData` SET `welcomeMessage` = ? WHERE `guild` = ?', [interaction.options.getString('message'), interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::SETMESSAGE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::SETMESSAGE:SUCCESS', { MESSAGE: `\`${interaction.options.getString('message')}\`` }))] })
        })
        break
      }
      case 'setbackground': {
        client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBackground` = ? WHERE `guild` = ?', [interaction.options.getString('url'), interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::SETBACKGROUND:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::SETBACKGROUND:SUCCESS', { URL: interaction.options.getString('url') }))] })
        })
        break
      }
      case 'enablecards': {
        client.pool.query('UPDATE `guildData` SET `welcomeImage` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::ENABLECARDS:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::ENABLECARDS:SUCCESS'))] })
        })
        break
      }
      case 'disablecards': {
        client.pool.query('UPDATE `guildData` SET `welcomeImage` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::DISABLECARDS:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::DISABLECARDS:SUCCESS'))] })
        })
        break
      }
      case 'overlayopacity': {
        client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOpacity` = ? WHERE `guild` = ?', [interaction.options.getNumber('opacity'), interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYOPACITY:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::OVERLAYOPACITY:SUCCESS', { OPACITY: interaction.options.getNumber('opacity') }))] })
        })
        break
      }
      case 'overlayblur': {
        client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBlur` = ? WHERE `guild` = ?', [interaction.options.getNumber('blur'), interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYBLUR:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::OVERLAYBLUR:SUCCESS', { BLUR: interaction.options.getNumber('blur') }))] })
        })
        break
      }
      case 'overlaycolor': {
        if (isHexcolor(interaction.options.getString('hexcolor'))) {
          client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOverlayColor` = ? WHERE `guild` = ?', [interaction.options.getString('hexcolor'), interaction.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYCOLOR:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::OVERLAYCOLOR:SUCCESS', { COLOR: interaction.options.getString('hexcolor') }))] })
          })
        } else {
          interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYCOLOR:NOTHEX'))] })
        }
        break
      }
      case 'roundavatar': {
        if (interaction.options.getBoolean('value') === true) {
          client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::ROUNDAVATAR:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::ROUNDAVATAR:SUCCESS', { STATUS: i18n(locale, 'ENABLE') }))] })
          })
        } else {
          client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::ROUNDAVATAR:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::ROUNDAVATAR:SUCCESS', { STATUS: i18n(locale, 'DISABLED') }))] })
          })
        }
        break
      }
      case 'test': {
        welcomeCard(client, interaction.member, locale, interaction.database).then((paths) => {
          const attachmentSent = new MessageAttachment(paths.attachmentSent)
          interaction.editReply({ files: [attachmentSent] }).then(() => {
            tempFileRemover(paths)
          })
        })
        break
      }
      case 'simulate': {
        interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER::SIMULATE:SENDING'))] })
        guildMemberAdd(client, interaction.member)
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('welcomer', i18n(locale, 'WELCOMER::HELPTRAY:DESCRIPTION'), [{ option: 'viewconfig', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:VIEWCONFIG') }, { option: 'enablecards', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:ENABLECARDS') }, { option: 'disablecards', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:DISABLECARDS') }, { option: 'overlayopacity', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:OVERLAYOPACITY'), syntax: 'overlayopacity <opacity quantity>' }, { option: 'overlayblur', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:OVERLAYBLUR'), syntax: 'overlayblur <blur quantity>' }, { option: 'overlaycolor', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:OVERLAYCOLOR'), syntax: 'overlaycolor <hex code>' }, { option: 'roundavatar', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:ROUNDAVATAR') }, { option: 'test', description: i18n(locale, 'WELCOMER::xºHELPTRAY:OPTION:TEST') }, { option: 'simulate', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:SIMULATE') }, { option: 'setbackground', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:SETBACKGROUND'), syntax: 'setbackground <url>' }])
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'viewconfig': {
          message.reply({ embeds: [Loader(i18n(locale, 'FETCHINGDATA'))] }).then((_message) => {
            const sentEmbed = new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:TITLE'))
              .setDescription(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:DESCRIPTION'))
              .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.welcomeChannel) || i18n(locale, 'UNSET')}`, true)
              .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${message.database.welcomeMessage || i18n(locale, 'UNSET')}`, true)
              .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS')}`, `${i18n(locale, 'STATUS')}: ${emojiRelationship[message.database.welcomeImage]}\n${i18n(locale, 'BACKGROUND')} [Ver imagen](${message.database.welcomeImageCustomBackground})\n${i18n(locale, 'OVERLAYCOLOR')}: ${message.database.welcomeImageCustomOverlayColor}\n${i18n(locale, 'OVERLAYBLUR')}: ${message.database.welcomeImageCustomBlur}\n${i18n(locale, 'OVERLAYOPACITY')}: ${message.database.welcomeImageCustomOpacity}\n${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS:ROUNDAVATAR')}: ${emojiRelationship[message.database.welcomeImageRoundAvatar]}`, false)

            _message.edit({ embeds: [sentEmbed] })
          })
          break
        }
        case 'setchannel': {
          if (message.mentions.channels.first()) {
            client.pool.query('UPDATE `guildData` SET `welcomeChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::SETCHANNEL:ERROR'))] })
              message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::SETCHANNEL:SUCCESS', { CHANNEL: message.mentions.channels.first() }))] })
            })
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        case 'setmessage': {
          const filter = m => m.member.id === message.member.id
          message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER::SETMESSAGE:ASKINPUT'))] })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            client.pool.query('UPDATE `guildData` SET `welcomeMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'WELCOMER::SETMESSAGE:ERROR'))] })
              message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER::SETMESSAGE:SUCCESS', { MESSAGE: collected.first().content }))] })
            })
          })
          break
        }
        case 'setbackground': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::SETBACKGROUND:ERROR'))] })
              message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::SETBACKGROUND:SUCCESS', { BACKGROUND: message.args[1] }))] })
            })
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        case 'enablecards': {
          client.pool.query('UPDATE `guildData` SET `welcomeImage` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::ENABLECARDS:ERROR'))] })
            message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::ENABLECARDS:SUCCESS'))] })
          })
          break
        }
        case 'disablecards': {
          client.pool.query('UPDATE `guildData` SET `welcomeImage` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::DISABLECARDS:ERROR'))] })
            message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::DISABLECARDS:SUCCESS'))] })
          })
          break
        }
        case 'overlayopacity': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOpacity` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYOPACITY:ERROR'))] })
              message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::OVERLAYOPACITY:SUCCESS', { OPACITY: message.args[1] }))] })
            })
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        case 'overlayblur': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBlur` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYBLUR:ERROR'))] })
              message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::OVERLAYBLUR:SUCCESS', { BLUR: message.args[1] }))] })
            })
          } else {
            message.reply({ embeds: [Status(i18n(locale, 'WELCOMER_OVERLAYBLUR_MISSING_ARGS', { WELCOMER_OVERLAYBLUR: message.database.welcomeImageCustomBlur }))] })
          }
          break
        }
        case 'overlaycolor': {
          if (message.args[1]) {
            if (isHexcolor(message.args[1])) {
              client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOverlayColor` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYCOLOR:ERROR'))] })
                message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::OVERLAYCOLOR:SUCCESS', { COLOR: message.args[1] }))] })
              })
            } else {
              message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::OVERLAYCOLOR:NOTHEX'))] })
            }
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        case 'roundavatar': {
          if (message.args[1]) {
            if (message.args[1] === 'true') {
              client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::ROUNDAVATAR:ERROR'))] })
                message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::ROUNDAVATAR:SUCCESS', { TYPE: 'round' }))] })
              })
            } else {
              client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::ROUNDAVATAR:ERROR'))] })
                message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::ROUNDAVATAR:SUCCESS', { TYPE: 'square' }))] })
              })
            }
          } else {
            message.reply({ embeds: [helpTray] })
          }
          break
        }
        case 'test': {
          welcomeCard(client, message.member, locale, message.database).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent)
            message.reply({ files: [attachmentSent] }).then(() => {
              tempFileRemover(paths)
            })
          })
          break
        }
        case 'simulate': {
          message.reply({ embeds: [Status(i18n(locale, 'WELCOMER::SIMULATE:SENDING'))] })
          guildMemberAdd(client, message.member)
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
