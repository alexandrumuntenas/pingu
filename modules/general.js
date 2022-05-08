const guildManager = require('../functions/guildManager')

module.exports.dashboard = () => {
  process.Client.Dashboard.addTextInput('Prefijo', 'Establece el prefijo con el cual se interactua con el bot', (prefijo) => prefijo.length > 0 && prefijo.length < 3, (undefinedClient, guild, nuevoPrefijo) => {
    guildManager.actualizarConfiguracionDelServidor(guild, { column: 'common', newconfig: { prefix: nuevoPrefijo } })
  }, (undefinedCLient, guild) => {
    guildManager.obtenerConfiguracionDelServidor(guild, (config) => {
      if (config) return config.common.prefix
    })
  })
}
