import Command from '../core/classes/Command'

import * as humanizarTiempo from 'humanize-duration'

import { ChannelType, Message } from 'discord.js'
import {
  ClientCommandsManager,
  ClientCooldownManager,
  ClientEventManager,
  ClientGuildManager,
  ClientMessageTemplate,
  ClientModuleManager,
  ClientUser
} from '../client'

import { deprecatedObtenerTraduccion } from '../core/i18nManager'
import Event from '../core/classes/Event'
import Consolex from '../core/consolex'
interface PinguMessage extends Message {
  rawCommand: string;
  command?: Command;
  args: Array<string>;
  guildConfiguration: {
    [key: string]: any; // skipcq: JS-0323
  };
}

export default new Event('messageCreate', (message: PinguMessage) => {
  if (message.channel.type === ChannelType.DM || message.author.bot || message.author === ClientUser.user) { return }

  ClientGuildManager.obtenerConfiguracionDelServidor(message.guild).then(
    (configuracionDelServidor) => {
      message.guildConfiguration = configuracionDelServidor

      ClientEventManager.ejecutarFuncionesDeTerceros('messageCreate', null, message)

      if (
        (message.content.startsWith(message.guildConfiguration.common.prefix) &&
          message.content !== message.guildConfiguration.common.prefix) ||
        message.content.startsWith(`<@${ClientUser.user?.id}>`) ||
        message.content.startsWith(`<@!${ClientUser.user?.id}>`)
      ) {
        if (message.content.startsWith(`<@${ClientUser.user?.id}>`)) {
          message.args = message.content
            .slice(`<@${ClientUser.user?.id}>`.length)
            .trim()
            .split(/ +/)
        } else if (message.content.startsWith(`<@!${ClientUser.user?.id}>`)) {
          message.args = message.content
            .slice(`<@!${ClientUser.user?.id}>`.length)
            .trim()
            .split(/ +/)
        } else {
          message.args = message.content
            .slice(message.guildConfiguration.common.prefix.length)
            .trim()
            .split(/ +/)
        }

        [message.rawCommand] = message.args
        message.args.shift()

        if (message.guildConfiguration.interactions && message.guildConfiguration.interactions.enforceusage) {
          return message.reply({
            embeds: [
              ClientMessageTemplate.error(
                deprecatedObtenerTraduccion(message.guildConfiguration.language, 'INTERACTION-ENFORCEUSAGE')
              )
            ]
          })
        }

        message.command = ClientCommandsManager.getCommand(message.rawCommand)

        if (ClientCooldownManager.check(message.member, message.command || { name: message.rawCommand })) {
          if (ClientCommandsManager.has(message.command?.name || message.rawCommand)) {
            if (message.command && message.command.module && ClientModuleManager.nombresModulosDisponibles.includes(message.command.module) && !message.guildConfiguration[message.command.module].enabled) {
              return message.reply({
                embeds: [
                  ClientMessageTemplate.error(deprecatedObtenerTraduccion('COMMAND::NOT_ENABLED', message.guild?.preferredLocale))
                ]
              })
            }

            if (message.command?.permissions && !message.member?.permissions.has(message.command.permissions, false)) {
              return message.reply({
                embeds: [
                  ClientMessageTemplate.error(deprecatedObtenerTraduccion('COMMAND::PERMERROR', message.guild?.preferredLocale))
                ]
              })
            }

            ClientCooldownManager.add(message.member, message.command || { name: message.rawCommand })

            if (message.command && Object.prototype.hasOwnProperty.call(message.command, 'runCommand') && message.command.runCommand instanceof Function) {
              return message.command?.runCommand(message)
            } else if (message.command) {
              return message.reply({
                embeds: [
                  ClientMessageTemplate.error(
                    deprecatedObtenerTraduccion(
                      message.guildConfiguration.common.language,
                      'COMMAND::ONLYINTERACTION'
                    )
                  )
                ]
              })
            }
          }
          return ClientEventManager.ejecutarFuncionesDeTerceros(
            'messageCreate',
            'withPrefix',
            message
          )
        }
        return message.reply({
          embeds: [
            ClientMessageTemplate.timeout(
              deprecatedObtenerTraduccion(
                'COOLDOWN',
                {
                  COOLDOWN: humanizarTiempo(
                    ClientCooldownManager.ttl(message.member, message.command || { name: message.rawCommand }),
                    {
                      round: true,
                      language:
                        message.guildConfiguration.common.language || 'en',
                      fallbacks: ['en']
                    }
                  )
                }
              )
            )
          ]
        })
      }

      return ClientEventManager.ejecutarFuncionesDeTerceros(
        'messageCreate',
        'noPrefix',
        message
      )
    }
  ).catch((err) => {
    Consolex.gestionarError(err)
  })
})

export { PinguMessage }
