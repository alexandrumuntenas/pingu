const { MessageEmbed } = require('discord.js')
const { cooldown } = require('../functions/commands')
const genericMessages = require('../functions/genericMessages')
const getLocales = require('../i18n/getLocales')
const autoresponder = require('../modules/autoresponder')
const guildFetchData = require('../modules/guildFetchData')
const { rankUp } = require('../modules/levels')

module.exports = async (client, message) => {
  if (
    message.channel.type === 'dm' ||
    message.author.bot ||
    message.author === client.user
  ) return
  guildFetchData(client, message.guild, async (guildData) => {
    message.database = guildData
    if (message.content.startsWith(message.database.guildPrefix) && message.content !== message.database.guildPrefix) {
      message.args = message.content.slice(message.database.guildPrefix.length).trim().split(/ +/)
    }
    if (message.content.startsWith(message.database.guildPrefix) && message.args) {
      let commandToExecute = message.args[0]
      message.args.shift()

      if (client.commands.has(commandToExecute)) {
        if (message.database.legacyCMD !== 0) {
          commandToExecute = client.commands.get(commandToExecute)
          if (commandToExecute.permissions && !message.member.permissions.has(commandToExecute.permissions)) {
            genericMessages.legacy.error.permissionerror(message, message.database.guildLanguage || 'en')
            return
          }
          if (cooldown.check(message.member, message.guild, commandToExecute)) {
            cooldown.add(message.member, message.guild, commandToExecute)
            if (Object.prototype.hasOwnProperty.call(commandToExecute, 'executeLegacy')) {
              await commandToExecute.executeLegacy(client, message.database.guildLanguage || 'en', message)
            } else {
              genericMessages.legacy.error(message, getLocales(message.database.guildLanguage || 'en', 'LEGACY_NOAVALIABLE'))
            }
          } else {
            genericMessages.legacy.error.cooldown(message, message.database.guildLanguage || 'en', (parseInt(cooldown.ttl(message.member, message.guild, commandToExecute)) - Date.now()))
            return
          }
        } else {
          genericMessages.legacy.Info.status(message, getLocales(message.database.guildLanguage || 'en', 'LEGACY_DISABLED'))
        }
      } else {
        if (cooldown.check(message.member, message.guild, commandToExecute)) {
          cooldown.add(message.member, message.guild, commandToExecute)
          const mCeEC = client.Sentry.startTransaction({
            op: 'messageCreate/executeExternalCommand',
            name: 'Execute External Command'
          })
          client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ?', [message.guild.id], (err, result) => {
            if (err) {
              client.Sentry.captureException(err)
              client.log.error(err)
            }
            if (Object.prototype.hasOwnProperty.call(result, 0)) {
              client.pool.query('SELECT * FROM `guildCustomCommands` WHERE `guild` = ? AND `customCommand` = ?', [message.guild.id, commandToExecute], (err, result) => {
                if (err) {
                  client.Sentry.captureException(err)
                  client.log.error(err)
                }
                if (Object.prototype.hasOwnProperty.call(result, 0)) {
                  const messageSent = new MessageEmbed()
                    .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png')
                    .setDescription(result[0].messageReturned)
                    .setColor('BLURPLE')
                  message.channel.send({ embeds: [messageSent] }).catch((err) => {
                    client.log.error(err)
                    client.Sentry.captureException(err)
                  }).finally(mCeEC.finish())
                }
              })
            }
          })
        } else {
          genericMessages.legacy.error.cooldown(message, message.database.guildLanguage || 'en', (parseInt(cooldown.ttl(message.member, message.guild, commandToExecute)) - Date.now()))
          return
        }
      }
    }
    if (message.database.levelsEnabled !== 0) {
      rankUp(client, message)
    }

    if (message.database.autoresponderEnabled !== 0) {
      autoresponder(client, message)
    }
  })
}
