const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  cooldown: 0,
  name: 'p2dismod',
  executeLegacy (client, locale, message) {
    if (message.guild.ownerId === message.member.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'welcomer': {
            client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
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
            client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
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
          case 'autoresponder': {
            client.pool.query('UPDATE `guildData` SET `autoresponderEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
              if (err) client.Sentry.captureException(err)
            })
            break
          }
          default: {
            helpTray(message, locale)
            return
          }
        }
        genericMessages.legacy.success(message, getLocales(locale, 'P2DISMOD', { PMODULE: `\`${message.args[0]}\`` }))
      } else {
        helpTray(message, locale)
      }
    } else {
      genericMessages.legacy.error.permissionerror(message, locale)
    }
  }
}

function helpTray (message, locale) {
  genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}p2dismod <module>`, ['welcomer', 'joinroles', 'farewell', 'moderation', 'levels', 'economy', 'autoresponder'])
}
