const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { welcomeCard } = require('../../modules/canvasProcessing')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')
const { fetchConfig } = require('../../modules/welcomerModule')
const emojiStrip = require('emoji-strip')
const tempFileRemover = require('../../modules/tempFileRemover')
const guildMemberAdd = require('../../events/guildMemberAdd')

const emojiRelationship = { 0: '<:discord_offline:876102753821278238>', 1: '<:discord_online:876102925129236481>' }

module.exports = {
  name: 'welcomer',
  execute (client, locale, message) {
    fetchConfig(client, message.guild, (data) => {
      if (data) {
        if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
          if (message.args[0]) {
            switch (message.args[0]) {
              case 'viewconfig': {
                message.channel.send('<a:loading:880765834774073344> Fetching data... Please wait.').then((_message) => {
                  const roles = new Set()

                  let rolset = ''

                  data.welcomeRoles.split(',').forEach(element => {
                    roles.add(element)
                  })

                  roles.forEach(element => {
                    rolset = rolset + '<@&' + element + '> '
                  })

                  const sentEmbed = new MessageEmbed()
                    .setColor('#17A2B8')
                    .setTitle(getLocales(locale, 'WELCOMER_VIEWCONFIG_TITLE'))
                    .setDescription(getLocales(locale, 'WELCOMER_VIEWCONFIG_DESCRIPTION'))
                    .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === data.welcomeChannel) || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
                    .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${data.welcomeMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
                    .addField(`<:blurple_image:892443053359517696> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_TITLE')}`, `${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ENABLED', { WELCOMER_BACKGROUND_STATUS: emojiRelationship[data.welcomeImage] })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_DEFAULTBACKGROUND', { WELCOMER_DEFAULTBACKGROUND: data.welcomeImageBackground })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_CUSTOMBACKGROUND', { WELCOMER_CUSTOMBACKGROUND: `[Ver imagen](${data.welcomeImageCustomBackground})` || getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_NOCUSTOMBACKGROUND') })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYBLUR', { WELCOMER_OVELAYBLUR: data.welcomeImageCustomBlur })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYOPACITY', { WELCOMER_OVERLAYOPACITY: data.welcomeImageCustomOpacity })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ROUNDAVATAR', { WELCOMER_ROUNDAVATAR: emojiRelationship[data.welcomeImageRoundAvatar] })}`, false)
                    .addField(`<:blurple_gift:892455451004911676> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ROLES')}`, rolset)

                  _message.edit({ content: 'Done', embeds: [sentEmbed] })
                })
                break
              }
              case 'channel': {
                if (message.mentions.channels.first()) {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_CHANNEL_SUCCESS', { WELCOMER_CHANNEL: message.mentions.channels.first() }))
                  })
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_CHANNEL_MISSING_ARGS', { WELCOMER_CHANNEL: message.guild.channels.cache.find(c => c.id === data.welcomeChannel) }))
                }
                break
              }
              case 'message': {
                const filter = m => m.author.id === message.author.id
                genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_MESSAGE_PREUPDATE'))
                message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeMessage` = ? WHERE `guild` = ?', [emojiStrip(collected.first().content), message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_MESSAGE_SUCCESS', { WELCOMER_MESSAGE: `\`${emojiStrip(collected.first().content)}\`` }))
                  })
                })
                break
              }
              case 'defaultBackground': {
                if (message.args[1]) {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeImageBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_DEFAULTBACKGROUND_SUCCESS', { WELCOMER_DEFAULTBACKGROUND: message.args[1] }))
                  })
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_DEFAULTBACKGROUND_MISSING_ARGS', { WELCOMER_DEFAULTBACKGROUND: data.welcomeImageBackground }))
                }
                break
              }
              case 'customBackground': {
                if (message.args[1]) {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeImageCustomBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_CUSTOMBACKGROUND_SUCCESS', { WELCOMER_CUSTOMBACKGROUND: message.args[1] }))
                  })
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_CUSTOMBACKGROUND_MISSING_ARGS', { WELCOMER_CUSTOMBACKGROUND: data.welcomeImageCustomBackground }))
                }
                break
              }
              case 'overlayOpacity': {
                if (message.args[1]) {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeImageCustomOpacity` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_OVERLAYOPACITY_SUCCESS', { WELCOMER_OVERLAYOPACITY: (message.args[1]) }))
                  })
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_OVERLAYOPACITY_MISSING_ARGS', { WELCOMER_OVERLAYOPACITY: data.welcomeImageCustomOpacity }))
                }
                break
              }
              case 'overlayBlur': {
                if (message.args[1]) {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeImageCustomBlur` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_OVERLAYBLUR_SUCCESS', { WELCOMER_OVERLAYBLUR: (message.args[1]) }))
                  })
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_OVERLAYBLUR_MISSING_ARGS', { WELCOMER_OVERLAYBLUR: data.welcomeImageCustomBlur }))
                }
                break
              }
              case 'roundAvatar': {
                if (message.args[1]) {
                  if (message.args[1] === 'true') {
                    client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeImageRoundAvatar` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
                      if (err) client.Sentry.captureException(err)
                      genericMessages.Success(message, getLocales(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: getLocales(locale, 'ENABLED') }))
                    })
                  } else {
                    client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeImageRoundAvatar` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
                      if (err) client.Sentry.captureException(err)
                      genericMessages.Success(message, getLocales(locale, 'WELCOMER_ROUNDAVATAR_SUCCESS', { WELCOMER_ROUNDAVATAR: getLocales(locale, 'DISABLED') }))
                    })
                  }
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_ROUNDAVATAR_MISSING_ARGS', { WELCOMER_ROUNDAVATAR: emojiRelationship[data.welcomeImageRoundAvatar] }))
                }
                break
              }
              case 'test': {
                welcomeCard(client, message.member, locale, data).then((paths) => {
                  const attachmentSent = new MessageAttachment(paths.attachmentSent)
                  message.channel.send({ files: [attachmentSent] }).then(() => {
                    tempFileRemover(paths)
                  })
                })
                break
              }
              case 'simulate': {
                genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_SIMULATE_SUCCESS'))
                guildMemberAdd(client, message.member)
                break
              }
            }
          } else {
            helpTray(message, locale)
          }
        } else {
          genericMessages.Error.permerror(message, locale)
        }
      } else {
        genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_INITIALIZE'))
      }
    })
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `\`${message.database.guild_prefix}welcomer <option>\``, ['viewconfig', 'channel <channel>', 'message', 'enableCards', 'disableCards', 'defaultBackground <background ID>', 'customBackground <background URL>', 'overlayOpacity <quantity>', 'overlayBlur <quantity>', 'roundAvatar <true/false>', 'test', 'simulate'])
}
