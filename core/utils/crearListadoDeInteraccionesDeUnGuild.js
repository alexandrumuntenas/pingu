const { Collection } = require('discord.js')

/**
 * Crea el listado de interacciones de un servidor bajo demanda
 * @param {Object} configuracionDelServidor - La configuración del servidor.
 * @returns {Object} - El listado de interacciones.
 */

module.exports = (configuracionDelServidor) => {
  if (Object.prototype.hasOwnProperty.call(configuracionDelServidor, 'interactions') && !configuracionDelServidor.interactions.showinteractions) return {}

  let interactionList = new Collection()

  process.Client.modulos.forEach(module => {
    if (Object.prototype.hasOwnProperty.call(configuracionDelServidor, module.nombre) && configuracionDelServidor[module.nombre].enabled) {
      interactionList = interactionList.concat(process.Client.comandos.filter(command => command.module === module.nombre) || [])
    }
  })

  interactionList = interactionList.concat(process.Client.comandos.filter(command => !command.module) || [])

  if (!configuracionDelServidor.common.interactions.showcfginteractions) interactionList = interactionList.filter(command => !command.isConfigurationCommand)

  return interactionList.map(command => command.interactionData.toJSON())
}
