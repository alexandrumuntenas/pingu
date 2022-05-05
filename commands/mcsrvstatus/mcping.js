const { obtenerDatosDelServidor } = require('../../modules/mcsrvstatus')
const { MessageAttachment, EmbedBuilder } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { plantillas } = require('../../core/messageManager')

module.exports = {
  name: 'mcping',
  module: 'mcsrvstatus',
  description: '🖥️ Ping the configured Minecraft server',
  cooldown: 1,
  runInteraction (interaction) {
    if (!interaction.guild.configuration.mcsrvstatus.host) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'MCPING::NO_HOST'))] })
    obtenerDatosDelServidor({ ip: interaction.guild.configuration.mcsrvstatus.host, port: interaction.guild.configuration.mcsrvstatus.port }, datosDelServidor => {
      if (datosDelServidor) {
        const attachment = new MessageAttachment(datosDelServidor.motd, 'motd.png')
        const embed = new EmbedBuilder()
          .addField(':radio_button: Version', datosDelServidor.version, true)
          .addField(':busts_in_silhouette: Players', datosDelServidor.jugadores, true)
          .addField(`${datosDelServidor.ping.emoji} Ping`, `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', true)
          .addField(':desktop: Address', datosDelServidor.direccion, false)
          .setImage('attachment://motd.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

        return interaction.editReply({ files: [attachment], embeds: [embed] })
      }

      return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'MCPING::ERROR'))] })
    })
  },
  runCommand (message) {
    if (!message.guild.configuration.mcsrvstatus.host) return message.reply({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'MCPING::NO_HOST'))] })
    message.reply({ embeds: [plantillas.precargador(i18n(message.guild.preferredLocale, 'OBTAININGDATA'))] }).then(_message => {
      obtenerDatosDelServidor({ ip: message.guild.configuration.mcsrvstatus.host, port: message.guild.configuration.mcsrvstatus.port }, datosDelServidor => {
        if (datosDelServidor) {
          const attachment = new MessageAttachment(datosDelServidor.motd, 'motd.png')
          const embed = new EmbedBuilder()
            .addField(':radio_button: Version', datosDelServidor.version, true)
            .addField(':busts_in_silhouette: Players', datosDelServidor.jugadores, true)
            .addField(`${datosDelServidor.ping.emoji} Ping`, `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', true)
            .addField(':desktop: Address', datosDelServidor.direccion, false)
            .setImage('attachment://motd.png')
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

          return _message.edit({ files: [attachment], embeds: [embed] })
        }

        return _message.edit({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'MCPING::ERROR'))] })
      })
    })
  }
}
