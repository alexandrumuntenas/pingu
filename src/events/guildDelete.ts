import Consolex from '../core/consolex'
import Event from '../classes/Event'
import { Guild } from 'discord.js'
import { ClientEventManager, ClientGuildManager } from '../client'

export default new Event('guildDelete', (guild: Guild) => {
  ClientGuildManager.eliminarRegistroDeServidor(guild).catch(Consolex.gestionarError)
  ClientEventManager.ejecutarFuncionesDeTerceros('guildDelete', null, guild)
})
