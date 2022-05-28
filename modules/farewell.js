module.exports.modeloDeConfiguracion = {
  enabled: 'boolean',
  channel: 'string',
  message: 'string'
}

/**
 * @param {GuildMember} member
 */

const { obtenerConfiguracionDelServidor } = require('../core/guildManager')

module.exports.doGuildMemberRemove = member => {
  obtenerConfiguracionDelServidor(member.guild).then(configuracionDelServidor => {
    if (Object.prototype.hasOwnProperty.call(configuracionDelServidor, 'farewell') && Object.prototype.hasOwnProperty.call(configuracionDelServidor.farewell, 'enabled')) {
      if (configuracionDelServidor.farewell.enabled) module.exports.sendFarewellMessage(member)
    }
  })
}

/**
 * @param {GuildMember} member
 */

const reemplazarPlaceholdersConDatosReales = require('../core/reemplazarPlaceholdersConDatosReales')

module.exports.sendFarewellMessage = member => {
  obtenerConfiguracionDelServidor(member.guild).then(configuracionDelServidor => {
    if (!Object.prototype.hasOwnProperty.call(configuracionDelServidor.farewell, 'channel')) return

    const channel = member.guild.channels.cache.get(configuracionDelServidor.farewell.channel)
    if (!channel) return

    channel.send(reemplazarPlaceholdersConDatosReales(configuracionDelServidor.farewell.message || '{member} left {server}!', member))
  })
}

module.exports.hooks = [{ event: 'guildMemberRemove', function: module.exports.doGuildMemberRemove }]
