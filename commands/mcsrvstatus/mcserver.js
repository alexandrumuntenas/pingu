const { generarMensajeEnriquecidoConDatosDelServidor } = require('../../modules/mcsrvstatus')
const { plantillas } = require('../../core/messageManager')
const { SlashCommandBuilder } = require('@discordjs/builders')

const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'mcserver',
  module: 'mcsrvstatus',
  description: '🖥️ Ping a specified Minecraft server',
  interaction: new SlashCommandBuilder().addStringOption(input => input.setName('ip_or_address').setRequired(true).setDescription('The IP or address of the server')).addStringOption(input => input.setName('port').setDescription('The port of the server')),
  cooldown: 10000,
  runInteraction (interaction) {
    generarMensajeEnriquecidoConDatosDelServidor({ ip: interaction.options.getString('ip_or_address'), port: interaction.options.getString('port') }, messageData => {
      interaction.editReply(messageData)
    })
  },
  runCommand (message) {
    if (!Object.prototype.hasOwnProperty.call(message.parameters, 0)) {
      return message.reply({
        embeds: plantillas.ayuda({
          name: module.exports.name,
          description: module.exports.description,
          parameters: '<ip_or_address> [port]',
          module: 'mcsrvstatus'
        })
      })
    }

    message.reply({ embeds: [plantillas.precargador(i18n.getTranslation(message.guild.preferredLocale, 'OBTAININGDATA'))] }).then(_message => {
      generarMensajeEnriquecidoConDatosDelServidor({ ip: message.parameters[0], port: message.parameters[1] }, messageData => {
        _message.edit(messageData)
      })
    })
  }
}
