const { Collection } = require('discord.js')

/**
 * Crea el listado de interacciones de un servidor bajo demanda
 * @param {Object} guildConfig - La configuración del servidor.
 * @returns {Object} - El listado de interacciones.
 */

module.exports = (guildConfig) => {
  if (Object.prototype.hasOwnProperty.call(guildConfig, 'interactions') && !guildConfig.interactions.showinteractions) return {}

  let interactionList = new Collection()

  process.Client.modulos.forEach(module => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, module.nombre) && guildConfig[module.nombre].enabled) {
      interactionList = interactionList.concat(process.Client.comandos.filter(command => command.module === module.nombre) || [])
    }
  })

  interactionList = interactionList.concat(process.Client.comandos.filter(command => !command.module) || [])

  if (!guildConfig.common.interactions.showcfginteractions) interactionList = interactionList.filter(command => !command.isConfigurationCommand)

  return interactionList.map(command => command.interactionData.toJSON())
}
