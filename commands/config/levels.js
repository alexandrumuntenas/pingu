const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')
const { fetchConfig } = require('../../modules/levelsModule')
const emojiStrip = require('emoji-strip')
const { isInteger } = require('mathjs')

module.exports = {
  name: 'levels',
  execute (client, locale, message) {
    fetchConfig(client, message.guild, (data) => {
      if (data) {
        if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
          if (message.args[0]) {
            switch (message.args[0]) {
              case 'viewconfig': {
                message.channel.send('<a:loading:880765834774073344> Fetching data... Please wait.').then((_message) => {
                  const sentEmbed = new MessageEmbed()
                    .setColor('BLURPLE')
                    .setTitle(getLocales(locale, 'LEVELS_VIEWCONFIG_TITLE'))
                    .setDescription(getLocales(locale, 'LEVELS_VIEWCONFIG_DESCRIPTION'))
                    .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === data.levelsChannel) || 'r/softwaregore'}`, true)
                    .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${data.levelsMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
                    .addField(`:trophy: ${getLocales(locale, 'LEVELS_VIEWCONFIG_DIFFICULTY')}`, `${data.levelsDifficulty}`, true)

                  _message.edit({ content: 'Done', embeds: [sentEmbed] })
                })
                break
              }
              case 'rankUpChannel': {
                if (message.mentions.channels.first()) {
                  client.pool.query('UPDATE `guildLevelsConfig` SET `levelsChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: message.mentions.channels.first() }))
                  })
                } else {
                  if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
                    switch (message.args[1]) {
                      case 'none': {
                        client.pool.query('UPDATE `guildLevelsConfig` SET `levelsChannel` = ? WHERE `guild` = ?', ['0', message.guild.id], (err) => {
                          if (err) client.Sentry.captureException(err)
                          genericMessages.Success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: 'none' }))
                        })
                        break
                      }
                      case 'same': {
                        client.pool.query('UPDATE `guildLevelsConfig` SET `levelsChannel` = ? WHERE `guild` = ?', ['1', message.guild.id], (err) => {
                          if (err) client.Sentry.captureException(err)
                          genericMessages.Success(message, getLocales(locale, 'LEVELS_CHANNEL_SUCCESS', { LEVELS_CHANNEL: 'same' }))
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
                  client.pool.query('UPDATE `guildLevelsConfig` SET `levelsMessage` = ? WHERE `guild` = ?', [emojiStrip(collected.first().content), message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'LEVELS_MESSAGE_SUCCESS', { LEVELS_MESSAGE: `\`${emojiStrip(collected.first().content)}\`` }))
                  })
                })
                break
              }
              case 'difficulty': {
                if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
                  if (isInteger(parseInt(message.args[1]))) {
                    client.pool.query('UPDATE `guildLevelsConfig` SET `levelsDifficulty` = ? WHERE `guild` = ?', [parseInt(message.args[1]), message.guild.id], (err) => {
                      if (err) client.Sentry.captureException(err)
                      genericMessages.Success(message, getLocales(locale, 'LEVELS_DIFFICULTY_SUCCESS', { LEVELS_DIFFICULTY: message.args[1] }))
                    })
                  } else {
                    genericMessages.Info.status(message, getLocales(locale, 'LEVELS_DIFFICULTY_NOT_INT'))
                  }
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'LEVELS_DIFFICULTY_MISSING_ARGS', { LEVELS_DIFFICULTY: data.levelsDifficulty }))
                }
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
        genericMessages.Info.status(message, getLocales(locale, 'LEVELS_INITIALIZE'))
      }
    })
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `\`${message.database.guild_prefix}levels <option>\``, ['viewconfig', 'rankUpChannel <channel>', 'rankUpMessage', 'difficulty <difficulty>'])
}
