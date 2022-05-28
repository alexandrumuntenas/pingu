const { ejecutarFuncionesDeTerceros } = require('../core/eventManager.js')
const { obtenerConfiguracionDelServidor } = require('../core/guildManager.js')

module.exports = {
  name: 'guildCreate',
  execute: guild => {
    obtenerConfiguracionDelServidor(guild)
    ejecutarFuncionesDeTerceros('guildCreate', null, guild)
  }
}
