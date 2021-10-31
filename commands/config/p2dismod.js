const { Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'p2dismod',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'welcomer': {
            client.pool.query('UPDATE `guildData` SET `welcomerEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'joinroles': {
            client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'farewell': {
            client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'moderation': {
            client.pool.query('UPDATE `guildData` SET `moderator_enabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'levels': {
            client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'economy': {
            client.pool.query('UPDATE `guildData` SET `economyEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          default: {
            helpTray(message, locale)
            return
          }
        }
        genericMessages.Success(message, getLocales(locale, 'P2DISMOD', { PMODULE: `\`${message.args[0]}\`` }))
      } else {
        helpTray(message, locale)
      }
    } else {
      genericMessages.Error.permerror(message, locale)
    }
  }
}

function helpTray (message, locale) {
  genericMessages.Info.help(message, locale, `${message.database.guildPrefix}p2dismod <module>`, ['welcomer', 'joinroles', 'farewell', 'moderation', 'levels', 'economy'])
}
