import Event from '../core/classes/Event.js'
import Consolex from '../core/consolex.js'
import { ClientEventManager, ClientGuildManager } from '../client.js'
export default new Event('guildCreate', (guild) => {
  ClientGuildManager.crearNuevoRegistroDeServidor(guild).catch(Consolex.gestionarError)
  ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'guildCreate' }, guild)
})
