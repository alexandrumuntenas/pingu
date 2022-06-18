import EventHook from '../classes/EventHook'
import Module from '../classes/Module'
import { ClientGuildManager } from '../client'
import { GuildMember } from 'discord.js'
import reemplazarPlaceholdersConDatosReales from '../core/utils/reemplazarPlaceholdersConDatosReales'

export default new Module(
  'Farewell',
  'Module for farewell messages',
  [
    new EventHook('guildMemberRemove', (member: GuildMember) => {
      ClientGuildManager.obtenerConfiguracionDelServidorPorModulo(
        member.guild,
        'farewell'
      ).then((configuracionDelServidor) => {
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

            const channel = member.guild.channels.cache.get(
              configuracionDelServidor.farewell.channel
            )
            if (!channel) return

            channel.send(
              reemplazarPlaceholdersConDatosReales(
                configuracionDelServidor.farewell.message ||
                  '{member} left {server}!',
                member
              )
            )
          }
        }
      })
    })
  ],
  { enabled: 'boolean', channel: 'string', message: 'string' },
  { enabled: false }
)
