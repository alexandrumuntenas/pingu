/* eslint consistent-return: "error" */

const CooldownManager = require('../functions/cooldownManager')

const { plantillas } = require('../functions/messageManager')
const i18n = require('../i18n/i18n')
const { obtenerConfiguracionDelServidor } = require('../functions/guildManager.js')
const humanizeduration = require('humanize-duration')
const { runCustomCommand } = require('../modules/customcommands')
const { getExperience } = require('../modules/leveling')
const { handleAutoRepliesInMessageCreate } = require('../modules/autoreplies')
const { GestorIncializadorDeAccionesEnmessageCreate } = require('../modules/moderation')

function ejecutarFunciones (message) { // skipcq: JS-D1001
  if (message.guild.configuration.leveling.enabled) {
    getExperience(message)
  }

  if (message.guild.configuration.autoreplies.enabled) {
    handleAutoRepliesInMessageCreate(message)
  }

  if (true || message.guild.configuration.moderation.enabled) { // Ahora se hace un bypass!
    GestorIncializadorDeAccionesEnmessageCreate(message)
  }
}

module.exports = {
  name: 'messageCreate',
  execute: async message => { // skipcq: JS-0116
    if (message.channel.type === 'dm' || message.author.bot || message.author === process.Client.user) return

    obtenerConfiguracionDelServidor(message.guild, guildConfig => {
      message.guild.configuration = guildConfig

      if ((message.content.startsWith(message.guild.configuration.common.prefix) && message.content !== message.guild.configuration.common.prefix) || message.content.startsWith(`<@!${process.Client.user.id}>`)) {
        if (message.content.startsWith(`<@!${process.Client.user.id}>`)) {
          message.parameters = message.content.slice(`<@!${process.Client.user.id}>`.length).trim().split(/ +/)
        } else {
          message.parameters = message.content.slice(message.guild.configuration.common.prefix.length).trim().split(/ +/)
        }

        [message.commandName] = message.parameters
        message.parameters.shift()

        if (!message.commandName) return process.Client.comandos.get('help').runCommand(message.guild.preferredLocale, message)

        const commandToExecute = process.Client.comandos.get(message.commandName)

        if (CooldownManager.check(message.member, message.guild, message.commandName)) {
          if (process.Client.comandos.has(message.commandName)) {
            if (commandToExecute.module && !guildConfig[commandToExecute.module].enabled) return message.reply({ embeds: [plantillas.error(i18n(message.guild.configuration.language, 'COMMAND::NOT_ENABLED'))] })

            if (commandToExecute.permissions && !message.member.permissions.has(commandToExecute.permissions)) return message.reply({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'COMMAND::PERMERROR'))] })

            CooldownManager.add(message.member, message.guild, commandToExecute)

            return Object.prototype.hasOwnProperty.call(commandToExecute, 'runCommand') ? commandToExecute.runCommand(message.guild.preferredLocale, message) : message.reply({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'COMMAND::ONLYINTERACTION'))] })
          } else if (message.guild.configuration.customcommands.enabled) {
            CooldownManager.add(message.member, message.guild, message.commandName)
            return runCustomCommand(message, message.commandName)
          }
        } else {
          return message.reply({ embeds: [plantillas.contador(i18n(message.guild.preferredLocale, 'COOLDOWN', { COOLDOWN: humanizeduration(CooldownManager.ttl(message.member, message.guild, message.commandName), { round: true, language: message.guild.preferredLocale || 'en-US', fallbacks: ['en-US'] }) }))] })
        }
      }

      return ejecutarFunciones(message)
    })
  }
}
