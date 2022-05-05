const { obtenerDatosDelServidor } = require('../../modules/mcsrvstatus')
const { MessageAttachment, EmbedBuilder } = require('discord.js')
const i18n = require('../../core/i18nManager')
const { plantillas } = require('../../core/messageManager')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'mcserver',
  module: 'mcsrvstatus',
  description: '🖥️ Ping a specified Minecraft server',
  interaction: new SlashCommandBuilder().addStringOption(input => input.setName('ip_or_address').setRequired(true).setDescription('The IP or address of the server')).addStringOption(input => input.setName('port').setDescription('The port of the server')),
  cooldown: 10000,
  runInteraction (interaction) {
    obtenerDatosDelServidor({ ip: interaction.options.getString('ip_or_address'), port: interaction.options.getString('port') }, datosDelServidor => {
      if (datosDelServidor) {
        const attachment = new MessageAttachment(datosDelServidor.motd, 'motd.png')
        const embed = new EmbedBuilder()
          .addField(':radio_button: Version', datosDelServidor.version, true)
          .addField(':busts_in_silhouette: Players', datosDelServidor.jugadores, true)
          .addField(`${datosDelServidor.ping.emoji} Ping`, `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', true)
          .addField(':desktop: Address', datosDelServidor.direccion, false)
          .setImage('attachment://motd.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()
        interaction.editReply({ files: [attachment], embeds: [embed] })
      } else {
        return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'MCPING::ERROR'))] })
      }
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
      try {
        obtenerDatosDelServidor({ ip: message.parameters[0], port: message.parameters[1] }, datosDelServidor => {
          if (datosDelServidor) {
            const attachment = new MessageAttachment(datosDelServidor.motd, 'motd.png')
            const embed = new EmbedBuilder()
              .addField(':radio_button: Version', datosDelServidor.version, true)
              .addField(':busts_in_silhouette: Players', datosDelServidor.jugadores, true)
              .addField(`${datosDelServidor.ping.emoji} Ping`, `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', true)
              .addField(':desktop: Address', datosDelServidor.direccion, false)
              .setImage('attachment://motd.png')
              .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()
            _message.edit({ files: [attachment], embeds: [embed] })
          } else {
            return _message.edit({ embeds: [plantillas.error(i18n.getTranslation(message.guild.preferredLocale, 'MCPING::ERROR'))] })
          }
        })
      } catch {
        _message.edit({ embeds: [plantillas.error(i18n.getTranslation(message.guild.preferredLocale, 'MCPING::ERROR'))] })
      }
    })
  }
}
