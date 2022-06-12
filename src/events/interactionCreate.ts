import { ChatInputCommandInteraction, Interaction, InteractionDeferReplyOptions } from 'discord.js'
import * as humanizeDuration from 'humanize-duration'
import Consolex from '../core/consolex'
import { obtenerTraduccion } from '../core/i18nManager'
import {
  ClientCommandsManager,
  ClientCooldownManager,
  ClientGuildManager,
  ClientMessageTemplate
} from '../client'
import Event from '../classes/Event'

class PinguChatInputCommandInteraction extends ChatInputCommandInteraction {
  deferredReply?: InteractionDeferReplyOptions
  guildConfiguration?: { [key: string]: any } // skipcq: JS-0323
}
function isChatInputCommand (interaction: PinguChatInputCommandInteraction) {
  ClientGuildManager.obtenerConfiguracionDelServidor(interaction.guild).then(async configuracionDelServidor => {
    interaction.guildConfiguration = configuracionDelServidor
    if (ClientCommandsManager.has(interaction.commandName)) {
      const interactionToRun = ClientCommandsManager.getCommand(interaction.commandName)

      if (interactionToRun.module && !configuracionDelServidor[interactionToRun.module].enabled) {
        return interaction.editReply({ embeds: [ClientMessageTemplate.error(obtenerTraduccion(interaction.guild.preferredLocale, 'COMMAND::NOT_ENABLED'))] })
      }

      if (interactionToRun.permissions && !interaction.memberPermissions.has(interactionToRun.permissions)) {
        return interaction.editReply({ embeds: [ClientMessageTemplate.error(obtenerTraduccion(interaction.guild.preferredLocale, 'COMMAND::PERMISSION_ERROR'))] })
      }

      if (ClientCooldownManager.check(interaction.member, interaction.guild, interactionToRun)) {
        ClientCooldownManager.add(interaction.member, interaction.guild, interactionToRun)

        await interactionToRun.runInteraction(interaction)
      } else {
        return interaction.editReply({ embeds: [ClientMessageTemplate.timeout(obtenerTraduccion(interaction.guild.preferredLocale, 'COOLDOWN', { COOLDOWN: humanizeDuration(ClientCooldownManager.ttl(interaction.member, interaction.guild, interactionToRun), { round: true, language: interaction.guildConfiguration.common.language || 'en-US', fallbacks: ['en-US'] }) }))] })
      }
    } else {
      return interaction.editReply({ content: obtenerTraduccion(interaction.guild.preferredLocale, 'COMMAND::NOT_FOUND') })
    }
  }).catch((err) => {
    Consolex.gestionarError(err)
  })
}

export default new Event('interactionCreate', (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    isChatInputCommand(interaction)
  }
})
