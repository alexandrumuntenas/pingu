const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'p2enmod',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'welcomer': {
            client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'joinroles': {
            client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'farewell': {
            client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'moderation': {
            client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'levels': {
            client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          case 'economy': {
            client.pool.query('UPDATE `guildData` SET `economyEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          default: {
            helpTray(message, locale)
            return
          }
        }
        genericMessages.success(message, getLocales(locale, 'P2ENMOD', { PMODULE: `\`${message.args[0]}\`` }))
      } else {
        helpTray(message, locale)
      }
    } else {
      genericMessages.error.permissionerror(message, locale)
    }
  }
}

function helpTray (message, locale) {
  genericMessages.Info.help(message, locale, `${message.database.guildPrefix}p2enmod <module>`, ['welcomer', 'joinroles', 'farewell', 'moderation', 'levels', 'economy'])
}
