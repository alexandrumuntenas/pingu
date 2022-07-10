import Event from '../core/classes/Event'
import Consolex from '../core/consolex'
import { Guild } from 'discord.js'
import { ClientEventManager, ClientGuildManager } from '../client'

export default new Event('guildCreate', (guild: Guild) => {
  ClientGuildManager.crearNuevoRegistroDeServidor(guild).catch(Consolex.gestionarError)
  ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildCreate' }, guild)
})
