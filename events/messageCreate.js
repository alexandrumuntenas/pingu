const { cooldown } = require('../functions/commands')
const { Status, Error } = require('../modules/constructor/messageBuilder')
const i18n = require('../i18n/i18n')
const autoresponder = require('../modules/autoresponder')
const guildFetchData = require('../functions/guildFetchData')
const { rankUp } = require('../modules/levels')
const humanizeduration = require('humanize-duration')
const customcommands = require('../modules/customcommands')

module.exports = {
  name: 'messageCreate',
  execute: async (client, message) => {
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
              message.reply({ embeds: [Error(i18n(message.database.guildLanguage || 'en', 'COMMAND_PERMISSION_ERROR'))] })
              return
            }
            if (cooldown.check(message.member, message.guild, commandToExecute)) {
              cooldown.add(message.member, message.guild, commandToExecute)
              if (Object.prototype.hasOwnProperty.call(commandToExecute, 'executeLegacy')) {
                if (client.statcord) client.statcord.postCommand(commandToExecute.name, message.member.id)
                await commandToExecute.executeLegacy(client, message.database.guildLanguage || 'en', message)
              } else {
                message.reply({ embeds: [Error(i18n(message.database.guildLanguage || 'en', 'LEGACY_NOAVALIABLE'))] })
              }
            } else {
              message.reply({ embeds: [Error(i18n(message.database.guildLanguage || 'en', 'COOLDOWN', { COOLDOWN: humanizeduration(cooldown, { round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en'] }) }))] })
              return
            }
          } else {
            message.reply({ embeds: [Status(i18n(message.database.guildLanguage || 'en', 'LEGACY_DISABLED'))] })
          }
        } else {
          if (cooldown.check(message.member, message.guild, commandToExecute)) {
            cooldown.add(message.member, message.guild, commandToExecute)
            customcommands(client, message, commandToExecute)
          } else {
            message.reply({ embeds: [Error(i18n(message.database.guildLanguage || 'en', 'COOLDOWN', { COOLDOWN: humanizeduration(cooldown, { round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en'] }) }))] })
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
}
