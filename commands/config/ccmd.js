const { Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'ccmd',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'create': {
            if (message.args[1] && message.args[2]) {
              const messageReturned = message.content.replace(`${message.database.guildPrefix}ccmd create ${message.args[1]}`, '')
              client.pool.query('INSERT INTO `guildCustomCommands` (`guild`, `customCommand`, `messageReturned`) VALUES (?,?,?)', [message.guild.id, message.args[1], messageReturned], function (err) {
                if (err) client.Sentry.captureException(err)
                genericMessages.Success(message, getLocales(locale, 'CCMD_CREATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: message.args[1], CCMD_VALUERETURNED: messageReturned }))
              })
            } else {
              helpTray(message, locale)
            }
            break
          }
          case 'remove': {
            if (message.args[1]) {
              client.pool.query('DELETE FROM `guildCustomCommands` WHERE `customCommand` = ? AND `guild` = ?', [message.args[1], message.guild.id], function (err) {
                if (err) client.Sentry.captureException(err)
                genericMessages.Success(message, getLocales(locale, 'CCMD_ELIMINATED_SUCCESFULLY', { CCMD_CUSTOMCOMMAND: message.args[1] }))
              })
            } else {
              helpTray(message, locale)
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
      genericMessages.Error.permerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `${message.database.guildPrefix}ccmd <option>`, ['create <command> <value to return ···>', 'remove <command>'])
}
