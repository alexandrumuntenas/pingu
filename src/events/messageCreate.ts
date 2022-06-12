import Command from '../classes/Command'

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

import { obtenerTraduccion } from '../core/i18nManager'
import Event from '../classes/Event'
interface PinguMessage extends Message {
  command: string | Command;
  args: Array<string>;
  guildConfiguration: {
    [key: string]: any;
  };
}

export default new Event('messageCreate', (message: PinguMessage) => {
  if (
    message.channel.type === ChannelType.DM ||
    message.author.bot ||
    message.author === ClientUser.user
  ) { return }

  ClientGuildManager.obtenerConfiguracionDelServidor(message.guild).then(
    (configuracionDelServidor) => {
      message.guildConfiguration = configuracionDelServidor

      ClientEventManager.ejecutarFuncionesDeTerceros(
        'messageCreate',
        null,
        message
      )

      if (
        (message.content.startsWith(message.guildConfiguration.common.prefix) &&
          message.content !== message.guildConfiguration.common.prefix) ||
        message.content.startsWith(`<@${ClientUser.user.id}>`) ||
        message.content.startsWith(`<@!${ClientUser.user.id}>`)
      ) {
        if (message.content.startsWith(`<@${ClientUser.user.id}>`)) {
          message.args = message.content
            .slice(`<@${ClientUser.user.id}>`.length)
            .trim()
            .split(/ +/)
        } else if (message.content.startsWith(`<@!${ClientUser.user.id}>`)) {
          message.args = message.content
            .slice(`<@!${ClientUser.user.id}>`.length)
            .trim()
            .split(/ +/)
        } else {
          message.args = message.content
            .slice(message.guildConfiguration.common.prefix.length)
            .trim()
            .split(/ +/)
        }

        [message.command] = message.args
        message.args.shift()

        if (!message.command) { return ClientCommandsManager.getCommand('help').runCommand(message) }

        if (
          message.guildConfiguration.interactions &&
          message.guildConfiguration.interactions.enforceusage
        ) {
          return message.reply({
            embeds: [
              ClientMessageTemplate.error(
                obtenerTraduccion(
                  message.guildConfiguration.language,
                  'INTERACTION-ENFORCEUSAGE'
                )
              )
            ]
          })
        }

        message.command = ClientCommandsManager.getCommand(message.command)

        if (
          ClientCooldownManager.check(
            message.member,
            message.guild,
            message.command
          )
        ) {
          if (ClientCommandsManager.has(message.command.name)) {
            if (
              message.command.module &&
              ClientModuleManager.modulosDisponibles.includes(
                ClientModuleManager.getModulo(message.command.module)
              ) &&
              !message.guildConfiguration[message.command.module].enabled
            ) {
              return message.reply({
                embeds: [
                  ClientMessageTemplate.error(
                    obtenerTraduccion(
                      message.guild.preferredLocale,
                      'COMMAND::NOT_ENABLED'
                    )
                  )
                ]
              })
            }

            if (
              message.command.permissions &&
              !message.member.permissions.has(
                message.command.permissions,
                false
              )
            ) {
              return message.reply({
                embeds: [
                  ClientMessageTemplate.error(
                    obtenerTraduccion(
                      message.guild.preferredLocale,
                      'COMMAND::PERMERROR'
                    )
                  )
                ]
              })
            }

            ClientCooldownManager.add(
              message.member,
              message.guild,
              message.command
            )

            return Object.prototype.hasOwnProperty.call(
              message.command,
              'runCommand'
            )
              ? message.command.runCommand(message)
              : message.reply({
                embeds: [
                  ClientMessageTemplate.error(
                    obtenerTraduccion(
                      message.guildConfiguration.common.language,
                      'COMMAND::ONLYINTERACTION'
                    )
                  )
                ]
              })
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
              obtenerTraduccion(
                message.guildConfiguration.common.language,
                'COOLDOWN',
                {
                  COOLDOWN: humanizarTiempo(
                    ClientCooldownManager.ttl(
                      message.member,
                      message.guild,
                      message.command
                    ),
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
  )
})
