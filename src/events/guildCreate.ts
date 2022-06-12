import Event from '../classes/Event'
import { Guild } from 'discord.js'
import { ClientEventManager, ClientGuildManager } from '../client'

export default new Event('guildCreate', (guild: Guild) => {
  ClientGuildManager.crearNuevoRegistroDeServidor(guild)
  ClientEventManager.ejecutarFuncionesDeTerceros('guildCreate', null, guild)
})
