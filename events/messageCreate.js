const CooldownManager = require('../functions/cooldownManager')

const { plantillas } = require('../../functions/messageManager')
const i18n = require('../i18n/i18n')
const { getGuildConfig } = require('../functions/guildDataManager.js')
const humanizeduration = require('humanize-duration')
const { runCustomCommand } = require('../modules/customcommands')
const { getExperience } = require('../modules/leveling')
const { handleAutoRepliesInMessageCreate } = require('../modules/autoreplies')

module.exports = {
  name: 'messageCreate',
  execute: async message => { // skipcq: JS-0116
    if (message.channel.type === 'dm' || message.author.bot || message.author === process.Client.user) return

    getGuildConfig(message.guild, async guildConfig => {
      message.guild.configuration = guildConfig

      if ((message.content.startsWith(message.guild.configuration.common.prefix) && message.content !== message.guild.configuration.common.prefix) || message.content.startsWith(`<@!${process.Client.user.id}>`)) {
        if (message.content.startsWith(`<@!${process.Client.user.id}>`)) {
          message.parameters = message.content.slice(`<@!${process.Client.user.id}>`.length).trim().split(/ +/)
        } else {
          message.parameters = message.content.slice(message.guild.configuration.common.prefix.length).trim().split(/ +/)
        }

        [message.commandName] = message.parameters
        message.parameters.shift()

        if (!message.commandName) {
          await process.Client.commands.get('help').runCommand(message.guild.configuration.common.language || 'es', message)
          return
        }

        const commandToExecute = process.Client.commands.get(message.commandName)

        if (CooldownManager.check(message.member, message.guild, message.commandName)) {
          if (process.Client.commands.has(message.commandName)) {
            if (commandToExecute.module && !guildConfig[commandToExecute.module].enabled) return message.reply({ embeds: [plantillas.error(i18n(message.guild.configuration.language || 'es', 'COMMAND::NOT_ENABLED'))] })

            if (commandToExecute.permissions && !message.member.permissions.has(commandToExecute.permissions)) return message.reply({ embeds: [plantillas.error(i18n(message.guild.configuration.common.language || 'es', 'COMMAND::PERMERROR'))] })

            CooldownManager.add(message.member, message.guild, commandToExecute)

            if (Object.prototype.hasOwnProperty.call(commandToExecute, 'runCommand')) {
              await commandToExecute.runCommand(message.guild.configuration.common.language || 'es', message)
            } else {
              message.reply({ embeds: [plantillas.error(i18n(message.guild.configuration.common.language || 'es', 'COMMAND::ONLYINTERACTION'))] })
            }
          } else if (message.guild.configuration.customcommands.enabled) {
            CooldownManager.add(message.member, message.guild, message.commandName)
            runCustomCommand(message, message.commandName)
          }
        } else {
          message.reply({ embeds: [plantillas.contador(i18n(message.guild.configuration.common.language || 'es', 'COOLDOWN', { COOLDOWN: humanizeduration(CooldownManager.ttl(message.member, message.guild, message.commandName), { round: true, language: message.guild.configuration.common.language || 'en', fallbacks: ['en'] }) }))] })
        }
      } else {
        if (message.guild.configuration.leveling.enabled) {
          getExperience(message)
        }

        if (message.guild.configuration.autoreplies.enabled) {
          handleAutoRepliesInMessageCreate(message)
        }
      }
    })
  }
}
