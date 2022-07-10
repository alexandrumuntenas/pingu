import Event from '../core/classes/Event'
import { Guild } from 'discord.js'
import { ClientEventManager, ClientGuildManager } from '../client'

export default new Event('guildDelete', (guild: Guild) => {
  ClientGuildManager.eliminarRegistroDeServidor(guild)
  ClientEventManager.deprecatedEjecutarFuncionesDeterceros('guildDelete', null, guild)
})
