const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'economy',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'viewconfig': {
            message.channel.send('<a:loader:871389840904695838> Fetching data... Please wait.').then((_message) => {
              const sentEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(getLocales(locale, 'ECONOMY_VIEWCONFIG_TITLE'))
                .setDescription(getLocales(locale, 'ECONOMY_VIEWCONFIG_DESCRIPTION'))
                .addField(`:coin: ${getLocales(locale, 'ECONOMY_VIEWCONFIG_CURRENCY')}`, `${message.database.economyCurrency}`, true)
                .addField(`:bank: ${getLocales(locale, 'ECONOMY_VIEWCONFIG_BANKNAME')}`, `${message.database.economyBankName}`)
                .setThumbnail(message.database.economyBankLogo)
              _message.edit({ content: 'Done', embeds: [sentEmbed] })
            })
            break
          }
          case 'setCurrency': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `economyCurrency` = ? WHERE `guild` = ?', [message.content.replace(`${message.database.guildPrefix}economy setCurrency `, ''), message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.Success(message, getLocales(locale, 'ECONOMY_CURRENCY_SUCCESS', { BANKCURRENCY: message.content.replace(`${message.database.guildPrefix}economy setCurrency `, '') }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'ECONOMY_CURRENCY_NOARGS', { BANKCURRENCY: message.database.economyCurrency }))
            }
            break
          }
          case 'setBankName': {
            if (message.args[1]) {
              client.pool.query('UPDATE `guildData` SET `economyBankName` = ? WHERE `guild` = ?', [message.content.replace(`${message.database.guildPrefix}economy setBankName `, ''), message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.Success(message, getLocales(locale, 'ECONOMY_BANKNAME_SUCCESS', { BANKNAME: message.content.replace(`${message.database.guildPrefix}economy setBankName `, '') }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'ECONOMY_BANKNAME_NOARGS', { BANKNAME: message.database.economyBankName }))
            }
            break
          }
          case 'setBankLogo': {
            if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
              client.pool.query('UPDATE `guildData` SET `economyBankLogo` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.Success(message, getLocales(locale, 'ECONOMY_BANKLOGO_RESOLVABLE', { BANKLOGO: message.args[1] }))
              })
            } else {
              helpTray()
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
  genericMessages.Info.help(message, locale, `\`${message.database.guildPrefix}economy <option>\``, ['viewconfig', 'setCurrency <new currency>', 'setBankName <new bank name>', 'setBankLogo <resolvable URL>'])
}
