const { ejecutarFuncionesDeTerceros } = require('../core/eventManager')
const { eliminarDatosDelServidor } = require('../core/guildManager')

module.exports = {
  name: 'guildDelete',
  execute: guild => {
    eliminarDatosDelServidor(guild)
    ejecutarFuncionesDeTerceros('guildDelete', null, guild)
  }
}
