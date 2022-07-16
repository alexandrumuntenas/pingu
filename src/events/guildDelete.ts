import Event from '../core/classes/Event.js'
import { Guild } from 'discord.js'
import { ClientEventManager, ClientGuildManager } from '../client.js'

export default new Event('guildDelete', (guild: Guild) => {
  ClientGuildManager.eliminarRegistroDeServidor(guild)
  ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildDelete' }, guild)
})
