const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { welcomeCard } = require('../../modules/canvasProcessing')
const { Success, Status, Help } = require('../../modules/constructor/messageBuilder')
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
  interactionData: new SlashCommandBuilder()
    .setName('welcomer')
    .setDescription('Configure the welcomer module')
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current welcomer configuration'))
    .addSubcommand(subcommand => subcommand.setName('channel').setDescription('Set the welcomer channel').addChannelOption(option => option.setName('welcomechannel').setDescription('Select a channel')))
    .addSubcommand(subcommand => subcommand.setName('message').setDescription('Set the welcomer message').addStringOption(option => option.setName('welcomemessage').setDescription('The message to be sent. Avaliable placeholders: {member} {guild}')))
    .addSubcommand(subcommand => subcommand.setName('enablecards').setDescription('Enable the welcomer cards'))
    .addSubcommand(subcommand => subcommand.setName('disablecards').setDescription('Disable the welcomer cards'))
    .addSubcommand(subcommand => subcommand.setName('custombackground').setDescription('Set the welcomer cards background').addStringOption(option => option.setName('url').setDescription('Enter a valid image URL')))
    .addSubcommand(subcommand => subcommand.setName('overlaycolor').setDescription('Set the welcomer cards overlay color').addStringOption(option => option.setName('hexcolor').setDescription('Enter a hex color')))
    .addSubcommand(subcommand => subcommand.setName('overlayopacity').setDescription('Set the welcomer cards overlay opacity').addNumberOption(option => option.setName('opacity').setDescription('Enter a number')))
    .addSubcommand(subcommand => subcommand.setName('overlayblur').setDescription('Set the welcomer cards overlay blur').addNumberOption(option => option.setName('blur').setDescription('Enter a number')))
    .addSubcommand(subcommand => subcommand.setName('roundavatar').setDescription('Set the welcomer cards round avatar').addBooleanOption(option => option.setName('value').setDescription('Select a value')))
    .addSubcommand(subcommand => subcommand.setName('test').setDescription('Test the welcomer message'))
    .addSubcommand(subcommand => subcommand.setName('simulate').setDescription('Simulate the welcomer message')),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const sentEmbed = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(i18n(locale, 'WELCOMER_VIEWCONFIG_TITLE'))
          .setDescription(i18n(locale, 'WELCOMER_VIEWCONFIG_DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.welcomeChannel) || i18n(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${interaction.database.welcomeMessage || i18n(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
          .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_TITLE')}`, `${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ENABLED', { WELCOMER_BACKGROUND_STATUS: emojiRelationship[interaction.database.welcomeImage] })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_CUSTOMBACKGROUND', { WELCOMER_CUSTOMBACKGROUND: `[Ver imagen](${interaction.database.welcomeImageCustomBackground})` || i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_NOCUSTOMBACKGROUND') })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYCOLOR', { WELCOMER_OVERLAYCOLOR: interaction.database.welcomeImageCustomOverlayColor })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYBLUR', { WELCOMER_OVELAYBLUR: interaction.database.welcomeImageCustomBlur })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYOPACITY', { WELCOMER_OVERLAYOPACITY: interaction.database.welcomeImageCustomOpacity })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ROUNDAVATAR', { WELCOMER_ROUNDAVATAR: emojiRelationship[interaction.database.welcomeImageRoundAvatar] })}`, false)

        interaction.editReply({ embeds: [sentEmbed] })
        break
      }
      case 'channel': {
        if (interaction.options.getChannel('welcomechannel')) {
          client.pool.query('UPDATE `guildData` SET `welcomeChannel` = ? WHERE `guild` = ?', [interaction.options.getChannel('welcomechannel').id, interaction.guild.id], (err) => {
            if (err) client.logError(err)
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_CHANNEL_SUCCESS', { WELCOMER_CHANNEL: interaction.options.getChannel('welcomechannel') }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_CHANNEL_MISSING_ARGS', { WELCOMER_CHANNEL: interaction.guild.channels.cache.find(c => c.id === interaction.database.welcomeChannel) }))] })
        }
        break
      }
      case 'message': {
        if (interaction.options.getString('welcomemessage')) {
          client.pool.query('UPDATE `guildData` SET `welcomeMessage` = ? WHERE `guild` = ?', [interaction.options.getString('welcomemessage'), interaction.guild.id], (err) => {
            if (err) client.logError(err)
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_MESSAGE_SUCCESS', { WELCOMER_MESSAGE: `\`${interaction.options.getString('welcomemessage')}\`` }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_MESSAGE_MISSING_ARGS', { WELCOMER_MESSAGE: interaction.database.welcomeMessage }))] })
        }
        break
      }
      case 'custombackground': {
        if (interaction.options.getString('url')) {
          client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBackground` = ? WHERE `guild` = ?', [interaction.options.getString('url'), interaction.guild.id], (err) => {
            if (err) client.logError(err)
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_CUSTOMBACKGROUND_SUCCESS', { WELCOMER_CUSTOMBACKGROUND: interaction.options.getString('url') }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_CUSTOMBACKGROUND_MISSING_ARGS', { WELCOMER_CUSTOMBACKGROUND: interaction.database.welcomeImageCustomBackground }))] })
        }
        break
      }
      case 'enablecards': {
        client.pool.query('UPDATE `guildData` SET `welcomeImage` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
          if (err) client.logError(err)
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_ENABLECARDS'))] })
        })
        break
      }
      case 'disablecards': {
        client.pool.query('UPDATE `guildData` SET `welcomeImage` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
          if (err) client.logError(err)
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_DISABLECARDS'))] })
        })
        break
      }
      case 'overlayopacity': {
        if (interaction.options.getNumber('opacity')) {
          client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOpacity` = ? WHERE `guild` = ?', [interaction.options.getNumber('opacity'), interaction.guild.id], (err) => {
            if (err) client.logError(err)
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_OVERLAYOPACITY_SUCCESS', { WELCOMER_OVERLAYOPACITY: interaction.options.getNumber('opacity') }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_OVERLAYOPACITY_MISSING_ARGS', { WELCOMER_OVERLAYOPACITY: interaction.database.welcomeImageCustomOpacity }))] })
        }
        break
      }
      case 'overlayblur': {
        if (interaction.options.getNumber('blur')) {
          client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBlur` = ? WHERE `guild` = ?', [interaction.options.getNumber('blur'), interaction.guild.id], (err) => {
            if (err) client.logError(err)
            interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_OVERLAYBLUR_SUCCESS', { WELCOMER_OVERLAYBLUR: interaction.options.getNumber('blur') }))] })
          })
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_OVERLAYBLUR_MISSING_ARGS', { WELCOMER_OVERLAYBLUR: interaction.database.welcomeImageCustomBlur }))] })
        }
        break
      }
      case 'overlaycolor': {
        if (interaction.options.getString('hexcolor')) {
          if (isHexcolor(interaction.options.getString('hexcolor'))) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOverlayColor` = ? WHERE `guild` = ?', [interaction.options.getString('hexcolor'), interaction.guild.id], (err) => {
              if (err) client.logError(err)
              interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_OVERLAYCOLOR_SUCCESS', { WELCOMER_OVERLAYCOLOR: interaction.options.getString('hexcolor') }))] })
            })
          } else {
            interaction.editReply({ embeds: [Status(i18n(locale, 'LEVELS_OVERLAYCOLOR_NOT_HEX'))] })
          }
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_OVERLAYCOLOR_MISSING_ARGS', { WELCOMER_OVERLAYCOLOR: interaction.database.welcomeImageCustomOverlayColor }))] })
        }
        break
      }
      case 'roundavatar': {
        if (interaction.options.getBoolean('value')) {
          if (interaction.options.getBoolean('value') === true) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
              if (err) client.logError(err)
              interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: i18n(locale, 'ENABLED') }))] })
            })
          } else {
            client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
              if (err) client.logError(err)
              interaction.editReply({ embeds: [Success(interaction, i18n(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: i18n(locale, 'DISABLED') }))] })
            })
          }
        } else {
          interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_ROUNDAVATAR_MISSING_ARGS', { WELCOMER_ROUNDAVATAR: emojiRelationship[interaction.database.welcomeImageRoundAvatar] }))] })
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
        interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER_SIMULATE_SUCCESS'))] })
        guildMemberAdd(client, interaction.member)
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('welcomer', i18n.help(locale, 'WELCOMER::DESCRIPTION'), [{ option: 'viewconfig', description: i18n.help(locale, 'WELCOMER::OPTION:VIEWCONFIG') }, { option: 'enablecards', description: i18n.help(locale, 'WELCOMER::OPTION:ENABLECARDS') }, { option: 'disablecards', description: i18n.help(locale, 'WELCOMER::OPTION:DISABLECARDS') }, { option: 'overlayopacity', description: i18n.help(locale, 'WELCOMER::OPTION:OVERLAYOPACITY'), syntax: 'overlayopacity <opacity quantity>' }, { option: 'overlayblur', description: i18n.help(locale, 'WELCOMER::OPTION:OVERLAYBLUR'), syntax: 'overlayblur <blur quantity>' }, { option: 'overlaycolor', description: i18n.help(locale, 'WELCOMER::OPTION:OVERLAYCOLOR'), syntax: 'overlaycolor <hex code>' }, { option: 'roundavatar', description: i18n.help(locale, 'WELCOMER::OPTION:ROUNDAVATAR') }, { option: 'test', description: i18n.help(locale, 'WELCOMER::OPTION:TEST') }, { option: 'simulate', description: i18n.help(locale, 'WELCOMER::OPTION:SIMULATE') }, { option: 'custombackground', description: i18n.help(locale, 'WELCOMER::OPTION:CUSTOMBACKGROUND'), syntax: 'custombackground <url>' }])
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'viewconfig': {
          message.channel.send('<a:loader:871389840904695838> Fetching data... Please wait.').then((_message) => {
            const sentEmbed = new MessageEmbed()
              .setColor('BLURPLE')
              .setTitle(i18n(locale, 'WELCOMER_VIEWCONFIG_TITLE'))
              .setDescription(i18n(locale, 'WELCOMER_VIEWCONFIG_DESCRIPTION'))
              .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.welcomeChannel) || i18n(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
              .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${message.database.welcomeMessage || i18n(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
              .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_TITLE')}`, `${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ENABLED', { WELCOMER_BACKGROUND_STATUS: emojiRelationship[message.database.welcomeImage] })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_CUSTOMBACKGROUND', { WELCOMER_CUSTOMBACKGROUND: `[Ver imagen](${message.database.welcomeImageCustomBackground})` || i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_NOCUSTOMBACKGROUND') })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYCOLOR', { WELCOMER_OVERLAYCOLOR: message.database.welcomeImageCustomOverlayColor })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYBLUR', { WELCOMER_OVELAYBLUR: message.database.welcomeImageCustomBlur })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYOPACITY', { WELCOMER_OVERLAYOPACITY: message.database.welcomeImageCustomOpacity })}\n${i18n(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ROUNDAVATAR', { WELCOMER_ROUNDAVATAR: emojiRelationship[message.database.welcomeImageRoundAvatar] })}`, false)

            _message.edit({ content: 'Done', embeds: [sentEmbed] })
          })
          break
        }
        case 'channel': {
          if (message.mentions.channels.first()) {
            client.pool.query('UPDATE `guildData` SET `welcomeChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
              if (err) client.logError(err)
              message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_CHANNEL_SUCCESS', { WELCOMER_CHANNEL: message.mentions.channels.first() }))] })
            })
          } else {
            message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_CHANNEL_MISSING_ARGS', { WELCOMER_CHANNEL: message.guild.channels.cache.find(c => c.id === message.database.welcomeChannel) }))] })
          }
          break
        }
        case 'message': {
          const filter = m => m.member.id === message.member.id
          message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_MESSAGE_PREUPDATE'))] })
          message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
            client.pool.query('UPDATE `guildData` SET `welcomeMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
              if (err) client.logError(err)
              message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_MESSAGE_SUCCESS', { WELCOMER_MESSAGE: `\`${collected.first().content}\`` }))] })
            })
          })
          break
        }
        case 'custombackground': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_CUSTOMBACKGROUND_SUCCESS', { WELCOMER_CUSTOMBACKGROUND: message.args[1] }))] })
            })
          } else {
            message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_CUSTOMBACKGROUND_MISSING_ARGS', { WELCOMER_CUSTOMBACKGROUND: message.database.welcomeImageCustomBackground }))] })
          }
          break
        }
        case 'enablecards': {
          client.pool.query('UPDATE `guildData` SET `welcomeImage` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.logError(err)
            message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_ENABLECARDS'))] })
          })
          break
        }
        case 'disablecards': {
          client.pool.query('UPDATE `guildData` SET `welcomeImage` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.logError(err)
            message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_DISABLECARDS'))] })
          })
          break
        }
        case 'overlayopacity': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOpacity` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_OVERLAYOPACITY_SUCCESS', { WELCOMER_OVERLAYOPACITY: (message.args[1]) }))] })
            })
          } else {
            message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_OVERLAYOPACITY_MISSING_ARGS', { WELCOMER_OVERLAYOPACITY: message.database.welcomeImageCustomOpacity }))] })
          }
          break
        }
        case 'overlayblur': {
          if (message.args[1]) {
            client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBlur` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_OVERLAYBLUR_SUCCESS', { WELCOMER_OVERLAYBLUR: (message.args[1]) }))] })
            })
          } else {
            message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_OVERLAYBLUR_MISSING_ARGS', { WELCOMER_OVERLAYBLUR: message.database.welcomeImageCustomBlur }))] })
          }
          break
        }
        case 'overlaycolor': {
          if (message.args[1]) {
            if (isHexcolor(message.args[1])) {
              client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOverlayColor` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.logError(err)
                message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_OVERLAYCOLOR_SUCCESS', { WELCOMER_OVERLAYCOLOR: message.args[1] }))] })
              })
            } else {
              message.channel.send({ embeds: [Status(i18n(locale, 'LEVELS_OVERLAYCOLOR_NOT_HEX'))] })
            }
          } else {
            message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_OVERLAYCOLOR_MISSING_ARGS', { WELCOMER_OVERLAYCOLOR: message.database.welcomeImageCustomOverlayColor }))] })
          }
          break
        }
        case 'roundavatar': {
          if (message.args[1]) {
            if (message.args[1] === 'true') {
              client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
                if (err) client.logError(err)
                message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: i18n(locale, 'ENABLED') }))] })
              })
            } else {
              client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
                if (err) client.logError(err)
                message.channel.send({ embeds: [Success(i18n(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: i18n(locale, 'DISABLED') }))] })
              })
            }
          } else {
            message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_ROUNDAVATAR_MISSING_ARGS', { WELCOMER_ROUNDAVATAR: emojiRelationship[message.database.welcomeImageRoundAvatar] }))] })
          }
          break
        }
        case 'test': {
          welcomeCard(client, message.member, locale, message.database).then((paths) => {
            const attachmentSent = new MessageAttachment(paths.attachmentSent)
            message.channel.send({ files: [attachmentSent] }).then(() => {
              tempFileRemover(paths)
            })
          })
          break
        }
        case 'simulate': {
          message.channel.send({ embeds: [Status(i18n(locale, 'WELCOMER_SIMULATE_SUCCESS'))] })
          guildMemberAdd(client, message.member)
          break
        }
        default: {
          message.channel.send({ embeds: [helpTray] })
          break
        }
      }
    } else {
      message.channel.send({ embeds: [helpTray] })
    }
  }
}
