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
  obtenerConfiguracionDelServidor(member.guild, guildConfig => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, 'farewell') && Object.prototype.hasOwnProperty.call(guildConfig.farewell, 'enabled')) {
      if (guildConfig.farewell.enabled) module.exports.sendFarewellMessage(member)
    }
  })
}

/**
 * @param {GuildMember} member
 */

const reemplazarPlaceholdersConDatosReales = require('../core/reemplazarPlaceholdersConDatosReales')

module.exports.sendFarewellMessage = member => {
  obtenerConfiguracionDelServidor(member.guild, guildConfig => {
    if (!Object.prototype.hasOwnProperty.call(guildConfig.farewell, 'channel')) return

    const channel = member.guild.channels.cache.get(guildConfig.farewell.channel)
    if (!channel) return

    channel.send(reemplazarPlaceholdersConDatosReales(guildConfig.farewell.message || '{member} left {server}!', member))
  })
}
