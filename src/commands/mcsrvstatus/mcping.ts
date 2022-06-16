const { generarMensajeEnriquecidoConDatosDelServidor } = require('../../modules/mcsrvstatus')
const { plantillas } = require('../../core/messageManager')

const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'mcping',
  module: 'mcsrvstatus',
  description: '🖥️ Ping the configured Minecraft server',
  cooldown: 1,
  runInteraction (interaction) {
    if (!interaction.guild.configuration.mcsrvstatus.host) return interaction.editReply({ embeds: [plantillas.error(i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'MCPING::NO_HOST'))] })
    generarMensajeEnriquecidoConDatosDelServidor({ ip: interaction.guild.configuration.mcsrvstatus.host, port: interaction.guild.configuration.mcsrvstatus.port }, messageData => {
      interaction.editReply(messageData)
    })
  },
  runCommand (message) {
    if (!message.guild.configuration.mcsrvstatus.host) return message.reply({ embeds: [plantillas.error(i18n.obtenerTraduccion(message.guild.preferredLocale, 'MCPING::NO_HOST'))] })
    message.reply({ embeds: [plantillas.precargador(i18n.obtenerTraduccion(message.guild.preferredLocale, 'OBTAININGDATA'))] }).then(_message => {
      generarMensajeEnriquecidoConDatosDelServidor({ ip: message.guild.configuration.mcsrvstatus.host, port: message.guild.configuration.mcsrvstatus.port }, messageData => {
        _message.edit(messageData)
      })
    })
  }
}
