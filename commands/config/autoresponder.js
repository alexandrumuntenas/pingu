const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const makeId = require('../../modules/makeId')

module.exports = {
  cooldown: 0,
  name: 'autoresponder',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      const filter = m => m.author.id === message.author.id
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'create': {
            if (message.args[1]) {
              message.channel.send({ content: `:arrow_right: ${getLocales(locale, 'AUTORESPONDER_CREATE_INSERTRIGGER')}` }).then((embedMenu) => {
                message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                  const autoresponderTrigger = collected.first().content.toLocaleLowerCase()
                  collected.first().delete()
                  embedMenu.edit({ content: `:arrow_right: ${getLocales(locale, 'AUTORESPONDER_CREATE_INSERTRESPONSE')}` })
                  message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                    const autoresponderResponse = collected.first().content
                    collected.first().delete()
                    const autoresponderId = message.args[1] || makeId(12)
                    client.pool.query('INSERT INTO `guildAutoResponder` (`guild`, `autoresponderID`, `autoresponderTrigger`, `autoresponderResponse`) VALUES (?,?,?,?)', [message.guild.id, autoresponderId, autoresponderTrigger, autoresponderResponse], function (err) {
                      if (err) client.Sentry.captureException(err)
                      genericMessages.success(message, getLocales(locale, 'AUTORESPONDER_CREATE_SUCCESS', { AUTORESPONDER_ID: autoresponderId }))
                    })
                  })
                })
              })
            } else {
              helpTray(message, locale)
            }
            break
          }
          case 'remove': {
            if (message.args[1]) {
              client.pool.query('DELETE FROM `guildAutoResponder` WHERE `autoresponderId` = ? AND `guild` = ?', [message.args[1], message.guild.id], function (err) {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'AUTORESPONDER_REMOVE_SUCCESS', { AUTORESPONDER_ID: message.args[1] }))
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
      genericMessages.error.permissionerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `${message.database.guildPrefix}autoresponder <option>`, ['create (custom ID)', 'remove <ID>'])
}
