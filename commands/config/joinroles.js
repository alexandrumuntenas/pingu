const { Permissions } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const { addJoinRole, removeJoinRole, fetchJoinRoles } = require('../../modules/joinroles')

module.exports = {
  name: 'joinroles',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'list': {
            fetchJoinRoles(client, message.guild, (roles) => {
              let itemsProcessed = 0
              let body = ''
              if (roles && Array.isArray(roles)) {
                if (roles.length > 0) {
                  roles.forEach(role => {
                    itemsProcessed++
                    body = ` <@&${role.roleID}>`
                    if (itemsProcessed === roles.length) genericMessages.Info.status(message, getLocales(locale, 'JOINROLES_LIST', { ROLES: body }))
                  })
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'JOINROLES_LIST_NOROLES'))
                }
              } else {
                genericMessages.Info.status(message, getLocales(locale, 'JOINROLES_LIST_NOROLES'))
              }
            })
            break
          }
          case 'add': {
            if (message.mentions.roles.first()) {
              message.mentions.roles.forEach(role => addJoinRole(client, { guild: message.guild, role: role }, () => genericMessages.success(message, getLocales(locale, 'JOINROLES_ADD', { ROLE: role }))))
            } else {
              helpTray(message, locale)
            }
            break
          }
          case 'remove': {
            if (message.mentions.roles.first()) {
              message.mentions.roles.forEach(role => removeJoinRole(client, { guild: message.guild, role: role }, () => genericMessages.success(message, getLocales(locale, 'JOINROLES_REMOVE', { ROLE: role }))))
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
  genericMessages.Info.help(message, locale, `${message.database.guildPrefix}joinroles <option>`, ['list', 'add @myrole (@myrole2 ··>)', 'remove @myrole (@myrole2 ··>)'])
}
