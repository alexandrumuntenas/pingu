const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const { isInteger } = require('mathjs')

const channelRelationship = { 0: 'Not Setup', 1: 'Same Channel where Message is Sent' }

module.exports = {
  cooldown: 0,
  name: 'levels',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'viewconfig': {
            message.channel.send('<a:loader:871389840904695838> Fetching data... Please wait.').then((_message) => {
              const sentEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(getLocales(locale, 'LEVELS_VIEWCONFIG_TITLE'))
                .setDescription(getLocales(locale, 'LEVELS_VIEWCONFIG_DESCRIPTION'))
                .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.levelsChannel) || channelRelationship[message.database.levelsChannel]}`, true)
                .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${message.database.levelsMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
                .addField(`:trophy: ${getLocales(locale, 'LEVELS_VIEWCONFIG_DIFFICULTY')}`, `${message.database.levelsDifficulty}`, true)

              _message.edit({ content: 'Done', embeds: [sentEmbed] })
            })
            break
          }
          case 'rankUpChannel': {
            if (message.mentions.channels.first()) {
              client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: message.mentions.channels.first() }))
              })
            } else {
              if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
                switch (message.args[1]) {
                  case 'none': {
                    client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', ['0', message.guild.id], (err) => {
                      if (err) client.Sentry.captureException(err)
                      genericMessages.success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: 'none' }))
                    })
                    break
                  }
                  case 'same': {
                    client.pool.query('UPDATE `guildData` SET `levelsChannel` = ? WHERE `guild` = ?', ['1', message.guild.id], (err) => {
                      if (err) client.Sentry.captureException(err)
                      genericMessages.success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: 'same' }))
                    })
                    break
                  }
                  default: {
                    genericMessages.Info.status(message, getLocales(locale, 'LEVELS_CHANNEL_MISSING_ARGS', { LEVELS_CHANNEL: 'r/softwaregore' }))
                    break
                  }
                }
              } else {
                genericMessages.Info.status(message, getLocales(locale, 'LEVELS_CHANNEL_MISSING_ARGS', { LEVELS_CHANNEL: 'r/softwaregore' }))
              }
            }
            break
          }
          case 'rankUpMessage': {
            const filter = m => m.author.id === message.author.id
            genericMessages.Info.status(message, getLocales(locale, 'LEVELS_MESSAGE_PREUPDATE'))
            message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
              client.pool.query('UPDATE `guildData` SET `levelsMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'LEVELS_MESSAGE_SUCCESS', { LEVELS_MESSAGE: `\`${collected.first().content}\`` }))
              })
            })
            break
          }
          case 'difficulty': {
            if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
              if (isInteger(parseInt(message.args[1]))) {
                client.pool.query('UPDATE `guildData` SET `levelsDifficulty` = ? WHERE `guild` = ?', [parseInt(message.args[1]), message.guild.id], (err) => {
                  if (err) client.Sentry.captureException(err)
                  genericMessages.success(message, getLocales(locale, 'LEVELS_DIFFICULTY_SUCCESS', { LEVELS_DIFFICULTY: message.args[1] }))
                })
              } else {
                genericMessages.Info.status(message, getLocales(locale, 'LEVELS_DIFFICULTY_NOT_INT'))
              }
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'LEVELS_DIFFICULTY_MISSING_ARGS', { LEVELS_DIFFICULTY: message.database.levelsDifficulty }))
            }
            break
          }
          case 'defaultBackground': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `levelsImageBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'LEVELS_DEFAULTBACKGROUND_SUCCESS', { LEVELS_DEFAULTBACKGROUND: message.args[1] }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'LEVELS_DEFAULTBACKGROUND_MISSING_ARGS', { LEVELS_DEFAULTBACKGROUND: message.database.welcomeImageBackground }))
            }
            break
          }
          case 'customBackground': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `levelsImageCustomBackground` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'LEVELS_CUSTOMBACKGROUND_SUCCESS', { LEVELS_CUSTOMBACKGROUND: message.args[1] }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'LEVELS_CUSTOMBACKGROUND_MISSING_ARGS', { LEVELS_CUSTOMBACKGROUND: message.database.welcomeImageCustomBackground }))
            }
            break
          }
          case 'overlayOpacity': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `levelsImageCustomOpacity` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'LEVELS_OVERLAYOPACITY_SUCCESS', { LEVELS_OVERLAYOPACITY: (message.args[1]) }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'LEVELS_OVERLAYOPACITY_MISSING_ARGS', { LEVELS_OVERLAYOPACITY: message.database.welcomeImageCustomOpacity }))
            }
            break
          }
          case 'overlayBlur': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `levelsImageCustomBlur` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'LEVELS_OVERLAYBLUR_SUCCESS', { LEVELS_OVERLAYBLUR: (message.args[1]) }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'LEVELS_OVERLAYBLUR_MISSING_ARGS', { LEVELS_OVERLAYBLUR: message.database.welcomeImageCustomBlur }))
            }
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
      genericMessages.error.permissionerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `\`${message.database.guildPrefix}levels <option>\``, ['viewconfig', 'rankUpChannel <channel>', 'rankUpMessage', 'difficulty <difficulty>', 'defaultBackground <background ID>', 'customBackground <background URL>', 'overlayOpacity <quantity>', 'overlayBlur <quantity>'])
}
