const { obtenerConfiguracionDelServidor } = require('../functions/guildManager.js')

module.exports = {
  name: 'guildCreate',
  execute: async guild => { // skipcq: JS-0116
    obtenerConfiguracionDelServidor(guild)
  }
}
