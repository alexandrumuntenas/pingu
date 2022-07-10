import EventHook from '../core/classes/EventHook'
import Module from '../core/classes/Module'
import { ClientGuildManager } from '../client'
import { GuildMember } from 'discord.js'
import reemplazarPlaceholdersConDatosReales from '../core/utils/reemplazarPlaceholdersConDatosReales'
import Consolex from '../core/consolex'
import { ChannelType } from 'discord-api-types/v10'

export default new Module(
  'Farewell',
  'Module for farewell messages',
  [
    new EventHook('guildMemberRemove', (member: GuildMember) => {
      ClientGuildManager.obtenerConfiguracionDelServidorPorModulo(member.guild, 'farewell').then((configuracionDelServidor) => {
        if (
          Object.prototype.hasOwnProperty.call(
            configuracionDelServidor,
            'farewell'
          ) &&
          Object.prototype.hasOwnProperty.call(
            configuracionDelServidor.farewell,
            'enabled'
          )
        ) {
          if (configuracionDelServidor.farewell.enabled) {
            if (
              !Object.prototype.hasOwnProperty.call(
                configuracionDelServidor.farewell,
                'channel'
              )
            ) {
              return
            }

            try {
              const channel = member.guild.channels.cache.get(configuracionDelServidor.farewell.channel)

              if (channel?.type === ChannelType.GuildText) {
                channel.send(reemplazarPlaceholdersConDatosReales(configuracionDelServidor.farewell.message || '{member} left {server}!', member))
              }
            } catch {
              Consolex.debug('No se ha podido entregar un mensaje de despedida. El canal especificado no era el apropiado.')
            }
          }
        }
      }).catch((guildMemberRemoveHookError) => Consolex.gestionarError(guildMemberRemoveHookError))
    })
  ],
  { enabled: 'boolean', channel: 'string', message: 'string' },
  { enabled: false, message: '**{user.tag}** just left the server' }
)
