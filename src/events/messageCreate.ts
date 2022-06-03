/* eslint consistent-return: "error" */

import { ChannelType, Message } from "discord.js";
import Command from "../classes/Command";
import { ClientCommandsManager, ClientCooldownManager, ClientUser } from "../client";

interface PinguMessage extends Message {
  command: string | Command;
  args: Array<string>;
  guildConfiguration: Object;
}

module.exports = {
  name: 'messageCreate',
  execute: (message: PinguMessage) => {
    if (message.channel.type === ChannelType.DM || message.author.bot || message.author === ClientUser.user) return

    obtenerConfiguracionDelServidor(message.guild).then(configuracionDelServidor => {
      message.guildConfiguration = configuracionDelServidor

      ejecutarFuncionesDeTerceros('messageCreate', null, message)

      if ((message.content.startsWith(message.guildConfiguration.common.prefix) && message.content !== message.guildConfiguration.common.prefix) || message.content.startsWith(`<@${ClientUser.user.id}>`) || message.content.startsWith(`<@!${ClientUser.user.id}>`)) {
        if (message.content.startsWith(`<@${ClientUser.user.id}>`)) {
          message.args = message.content
            .slice(`<@${ClientUser.user.id}>`.length)
            .trim()
            .split(/ +/);
        } else if (message.content.startsWith(`<@!${ClientUser.user.id}>`)) {
          message.args = message.content
            .slice(`<@!${ClientUser.user.id}>`.length)
            .trim()
            .split(/ +/);
        } else {
          message.args = message.content
            .slice(message.guildConfiguration.common.prefix.length)
            .trim()
            .split(/ +/);
        }

        [message.command] = message.args;
        message.args.shift();

        if (!message.command) return ClientCommandsManager.getCommand('help').runCommand(message)

        if (message.guildConfiguration.interactions && message.guildConfiguration.interactions.enforceusage) {
          return message.reply({ embeds: [plantillas.error(i18n.obtenerTraduccion(message.guildConfiguration.language, 'INTERACTION-ENFORCEUSAGE'))] })
        }

        message.command = ClientCommandsManager.getCommand(message.command)

        if (ClientCooldownManager.check(message.member, message.guild, message.command)) {
          if (ClientCommandsManager.has(message.command.name)) {
            if (message.command.module && modulosDisponibles.includes(message.command.module) && !message.guildConfiguration[message.command.module].enabled) return message.reply({ embeds: [plantillas.error(i18n.obtenerTraduccion(message.guild.preferredLocale, 'COMMAND::NOT_ENABLED'))] })

            if (message.command.permissions && !message.member.permissions.has(message.command.permissions)) return message.reply({ embeds: [plantillas.error(i18n.obtenerTraduccion(message.guild.preferredLocale, 'COMMAND::PERMERROR'))] })

            CooldownManager.add(message.member, message.guild, message.command);

            return Object.prototype.hasOwnProperty.call(message.command, 'runCommand') ? message.command.runCommand(message) : message.reply({ embeds: [plantillas.error(i18n.obtenerTraduccion(message.guildConfiguration.common.language, 'COMMAND::ONLYINTERACTION'))] })
          }
          return ejecutarFuncionesDeTerceros('messageCreate', 'withPrefix', message)
        }
        return message.reply({ embeds: [plantillas.contador(i18n.obtenerTraduccion(message.guildConfiguration.common.language, 'COOLDOWN', { COOLDOWN: humanizeduration(CooldownManager.ttl(message.member, message.guild, message.command), { round: true, language: message.guildConfiguration.common.language || 'en', fallbacks: ['en'] }) }))] })
      }

      return ejecutarFuncionesDeTerceros('messageCreate', 'noPrefix', message)
    })
  }
}
