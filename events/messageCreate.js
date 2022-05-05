/* eslint consistent-return: "error" */

const CooldownManager = require('../core/cooldownManager')

const { plantillas } = require('../core/messageManager')
const i18n = require('../core/i18nManager')
const { obtenerConfiguracionDelServidor } = require('../core/guildManager.js')
const humanizeduration = require('humanize-duration')
const { ejecutarFuncionesDeTerceros } = require('../core/eventManager')

module.exports = {
  name: 'messageCreate',
  execute: async message => { // skipcq: JS-0116
    if (message.channel.type === 'dm' || message.author.bot || message.author === process.Client.user) return

    obtenerConfiguracionDelServidor(message.guild, guildConfig => {
      message.guild.configuration = guildConfig

      if (Object.prototype.hasOwnProperty.call(guildConfig, 'interactions') && guildConfig.interactions.enforceusage) return message.reply('Smth') // TODO: Preparar mensaje de error

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

            return Object.prototype.hasOwnProperty.call(commandToExecute, 'runCommand') ? commandToExecute.runCommand(message.guild.configuration.common.language, message) : message.reply({ embeds: [plantillas.error(i18n(message.guild.configuration.common.language, 'COMMAND::ONLYINTERACTION'))] })
          }
          return ejecutarFuncionesDeTerceros('messageCreate', 'withPrefix', message)
        }
        return message.reply({ embeds: [plantillas.contador(i18n(message.guild.configuration.common.language, 'COOLDOWN', { COOLDOWN: humanizeduration(CooldownManager.ttl(message.member, message.guild, message.commandName), { round: true, language: message.guild.configuration.common.language || 'en', fallbacks: ['en'] }) }))] })
      }

      return ejecutarFuncionesDeTerceros('messageCreate', 'noPrefix', message)
    })
  }
}
