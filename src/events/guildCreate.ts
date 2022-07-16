import Event from '../core/classes/Event.js'
import Consolex from '../core/consolex.js'
import { Guild } from 'discord.js'
import { ClientEventManager, ClientGuildManager } from '../client.js'

export default new Event('guildCreate', (guild: Guild) => {
  ClientGuildManager.crearNuevoRegistroDeServidor(guild).catch(Consolex.gestionarError)
  ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildCreate' }, guild)
})
