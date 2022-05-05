const { eliminarDatosDelServidor } = require('../core/guildManager')

module.exports = {
  name: 'guildDelete',
  execute: async guild => { // skipcq: JS-0116
    eliminarDatosDelServidor(guild)
  }
}
