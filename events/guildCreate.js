const { obtenerConfiguracionDelServidor } = require('../core/guildManager.js')

module.exports = {
  name: 'guildCreate',
  execute: guild => { // skipcq: JS-0116
    obtenerConfiguracionDelServidor(guild)
  }
}
