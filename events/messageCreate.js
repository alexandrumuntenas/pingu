const { MessageEmbed } = require('discord.js')
const { cooldown } = require('../functions/commands')
const { Status, Error } = require('../modules/constructor/messageBuilder')
const getLocales = require('../i18n/getLocales')
const autoresponder = require('../modules/autoresponder')
const guildFetchData = require('../functions/guildFetchData')
const { rankUp } = require('../modules/levels')
const humanizeduration = require('humanize-duration')

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
            message.reply({ embeds: [Error(getLocales(message.database.guildLanguage || 'en', 'COMMAND_PERMISSION_ERROR'))] })
            return
          }
          if (cooldown.check(message.member, message.guild, commandToExecute)) {
            cooldown.add(message.member, message.guild, commandToExecute)
            if (Object.prototype.hasOwnProperty.call(commandToExecute, 'executeLegacy')) {
              if (client.statcord) client.statcord.postCommand(commandToExecute.name, message.member.id)
              await commandToExecute.executeLegacy(client, message.database.guildLanguage || 'en', message)
            } else {
              message.reply({ embeds: [Error(getLocales(message.database.guildLanguage || 'en', 'LEGACY_NOAVALIABLE'))] })
            }
          } else {
            message.reply({ embeds: [Error(getLocales(message.database.guildLanguage || 'en', 'COOLDOWN', { COOLDOWN: humanizeduration(cooldown, { round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en'] }) }))] })
            return
          }
        } else {
          message.reply({ embeds: [Status(getLocales(message.database.guildLanguage || 'en', 'LEGACY_DISABLED'))] })
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
          message.reply({ embeds: [Error(getLocales(message.database.guildLanguage || 'en', 'COOLDOWN', { COOLDOWN: humanizeduration(cooldown, { round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en'] }) }))] })
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
