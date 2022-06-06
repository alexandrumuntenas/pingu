import { ejecutarFuncionesDeTerceros } from '../core/eventManager'
import { obtenerConfiguracionDelServidor } from '../core/guildManager.js'

module.exports = {
  name: 'guildCreate',
  execute: guild => {
    obtenerConfiguracionDelServidor(guild)
    ejecutarFuncionesDeTerceros('guildCreate', null, guild)
  }
}
