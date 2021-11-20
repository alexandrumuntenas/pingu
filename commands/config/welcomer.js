const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { welcomeCard } = require('../../modules/canvasProcessing')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const tempFileRemover = require('../../functions/tempFileRemover')
const guildMemberAdd = require('../../events/guildMemberAdd')
const isHexcolor = require('is-hexcolor')

const emojiRelationship = { 0: '<:discord_offline:876102753821278238>', 1: '<:discord_online:876102925129236481>' }

module.exports = {
  cooldown: 0,
  name: 'welcomer',
  executeLegacy (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'viewconfig': {
            message.channel.send('<a:loader:871389840904695838> Fetching data... Please wait.').then((_message) => {
              const sentEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(getLocales(locale, 'WELCOMER_VIEWCONFIG_TITLE'))
                .setDescription(getLocales(locale, 'WELCOMER_VIEWCONFIG_DESCRIPTION'))
                .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.welcomeChannel) || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
                .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${message.database.welcomeMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
                .addField(`<:blurple_image:892443053359517696> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_TITLE')}`, `${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ENABLED', { WELCOMER_BACKGROUND_STATUS: emojiRelationship[message.database.welcomeImage] })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_CUSTOMBACKGROUND', { WELCOMER_CUSTOMBACKGROUND: `[Ver imagen](${message.database.welcomeImageCustomBackground})` || getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_NOCUSTOMBACKGROUND') })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYCOLOR', { WELCOMER_OVERLAYCOLOR: message.database.welcomeImageCustomOverlayColor })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYBLUR', { WELCOMER_OVELAYBLUR: message.database.welcomeImageCustomBlur })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYOPACITY', { WELCOMER_OVERLAYOPACITY: message.database.welcomeImageCustomOpacity })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ROUNDAVATAR', { WELCOMER_ROUNDAVATAR: emojiRelationship[message.database.welcomeImageRoundAvatar] })}`, false)

              _message.edit({ content: 'Done', embeds: [sentEmbed] })
            })
            break
          }
          case 'channel': {
            if (message.mentions.channels.first()) {
              client.pool.query('UPDATE `guildData` SET `welcomeChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_CHANNEL_SUCCESS', { WELCOMER_CHANNEL: message.mentions.channels.first() }))
              })
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_CHANNEL_MISSING_ARGS', { WELCOMER_CHANNEL: message.guild.channels.cache.find(c => c.id === message.database.welcomeChannel) }))
            }
            break
          }
          case 'message': {
            const filter = m => m.author.id === message.author.id
            genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_MESSAGE_PREUPDATE'))
            message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
              client.pool.query('UPDATE `guildData` SET `welcomeMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_MESSAGE_SUCCESS', { WELCOMER_MESSAGE: `\`${collected.first().content}\`` }))
              })
            })
            break
          }
          case 'custombackground': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_CUSTOMBACKGROUND_SUCCESS', { WELCOMER_CUSTOMBACKGROUND: message.args[1] }))
              })
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_CUSTOMBACKGROUND_MISSING_ARGS', { WELCOMER_CUSTOMBACKGROUND: message.database.welcomeImageCustomBackground }))
            }
            break
          }
          case 'enablecards': {
            client.pool.query('UPDATE `guildData` SET `welcomeImage` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
              genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_ENABLECARDS'))
            })
            break
          }
          case 'disablecards': {
            client.pool.query('UPDATE `guildData` SET `welcomeImage` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
              genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_DISABLECARDS'))
            })
            break
          }
          case 'overlayopacity': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOpacity` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_OVERLAYOPACITY_SUCCESS', { WELCOMER_OVERLAYOPACITY: (message.args[1]) }))
              })
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_OVERLAYOPACITY_MISSING_ARGS', { WELCOMER_OVERLAYOPACITY: message.database.welcomeImageCustomOpacity }))
            }
            break
          }
          case 'overlayblur': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `welcomeImageCustomBlur` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_OVERLAYBLUR_SUCCESS', { WELCOMER_OVERLAYBLUR: (message.args[1]) }))
              })
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_OVERLAYBLUR_MISSING_ARGS', { WELCOMER_OVERLAYBLUR: message.database.welcomeImageCustomBlur }))
            }
            break
          }
          case 'overlaycolor': {
            if (message.args[1]) {
              if (isHexcolor(message.args[1])) {
                client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOverlayColor` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                  if (err) client.Sentry.captureException(err)
                  genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_OVERLAYCOLOR_SUCCESS', { WELCOMER_OVERLAYCOLOR: message.args[1] }))
                })
              } else {
                genericMessages.legacy.Info.status(message, getLocales(locale, 'LEVELS_OVERLAYCOLOR_NOT_HEX'))
              }
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_OVERLAYCOLOR_MISSING_ARGS', { WELCOMER_OVERLAYCOLOR: message.database.welcomeImageCustomOverlayColor }))
            }
            break
          }
          case 'roundavatar': {
            if (message.args[1]) {
              if (message.args[1] === 'true') {
                client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
                  if (err) client.Sentry.captureException(err)
                  genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: getLocales(locale, 'ENABLED') }))
                })
              } else {
                client.pool.query('UPDATE `guildData` SET `welcomeImageRoundAvatar` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
                  if (err) client.Sentry.captureException(err)
                  genericMessages.legacy.success(message, getLocales(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: getLocales(locale, 'DISABLED') }))
                })
              }
            } else {
              genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_ROUNDAVATAR_MISSING_ARGS', { WELCOMER_ROUNDAVATAR: emojiRelationship[message.database.welcomeImageRoundAvatar] }))
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
            genericMessages.legacy.Info.status(message, getLocales(locale, 'WELCOMER_SIMULATE_SUCCESS'))
            guildMemberAdd(client, message.member)
            break
          }
          default: {
            helpTray(message, locale)
            break
          }
        }
      } else {
        helpTray(message, locale)
      }
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.legacy.Info.help(message, locale, `\`${message.database.guildPrefix}welcomer <option>\``, ['viewconfig', 'channel <channel>', 'message', 'enablecards', 'disablecards', 'customBackground <background URL>', 'overlaycolor <hex code>', 'overlayopacity <quantity>', 'overlayblur <quantity>', 'roundavatar <true/false>', 'test', 'simulate'])
}
