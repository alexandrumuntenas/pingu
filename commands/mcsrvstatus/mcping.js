const { obtenerDatosDelServidor } = require('../../modules/mcsrvstatus')
const { EmbedBuilder, Attachment } = require('discord.js')
const { plantillas } = require('../../core/messageManager')

const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'mcping',
  module: 'mcsrvstatus',
  description: '🖥️ Ping the configured Minecraft server',
  cooldown: 1,
  runInteraction (interaction) {
    if (!interaction.guild.configuration.mcsrvstatus.host) return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'MCPING::NO_HOST'))] })
    obtenerDatosDelServidor({ ip: interaction.guild.configuration.mcsrvstatus.host, port: interaction.guild.configuration.mcsrvstatus.port }, datosDelServidor => {
      if (datosDelServidor) {
        const serverMotd = new Attachment(datosDelServidor.motd, 'motd.png')
        const serverIcon = new Attachment(datosDelServidor.icono, 'icon.png')
        const embed = new EmbedBuilder()
          .addFields([
            { name: ':radio_button: Version', value: datosDelServidor.version, inline: true },
            { name: ':busts_in_silhouette: Players', value: datosDelServidor.jugadores, inline: true },
            { name: `${datosDelServidor.ping.emoji} Ping`, value: `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', inline: true },
            { name: ':desktop: Address', value: datosDelServidor.direccion, inline: true }
          ])
          .setThumbnail('attachment://icon.png')
          .setImage('attachment://motd.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

        return interaction.editReply({ files: [serverMotd, serverIcon], embeds: [embed] })
      }

      return interaction.editReply({ embeds: [plantillas.error(i18n.getTranslation(interaction.guild.preferredLocale, 'MCPING::ERROR'))] })
    })
  },
  runCommand (message) {
    if (!message.guild.configuration.mcsrvstatus.host) return message.reply({ embeds: [plantillas.error(i18n.getTranslation(message.guild.preferredLocale, 'MCPING::NO_HOST'))] })
    message.reply({ embeds: [plantillas.precargador(i18n.getTranslation(message.guild.preferredLocale, 'OBTAININGDATA'))] }).then(_message => {
      obtenerDatosDelServidor({ ip: message.guild.configuration.mcsrvstatus.host, port: message.guild.configuration.mcsrvstatus.port }, datosDelServidor => {
        if (datosDelServidor) {
          const serverMotd = new Attachment(datosDelServidor.motd, 'motd.png')
          const serverIcon = new Attachment(datosDelServidor.icono, 'icon.png')
          const embed = new EmbedBuilder()
            .addFields([
              { name: ':radio_button: Version', value: datosDelServidor.version, inline: true },
              { name: ':busts_in_silhouette: Players', value: datosDelServidor.jugadores, inline: true },
              { name: `${datosDelServidor.ping.emoji} Ping`, value: `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', inline: true },
              { name: ':desktop: Address', value: datosDelServidor.direccion, inline: true }
            ])
            .setThumbnail('attachment://icon.png')
            .setImage('attachment://motd.png')
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

          return _message.edit({ files: [serverMotd, serverIcon], embeds: [embed] })
        }

        return _message.edit({ embeds: [plantillas.error(i18n.getTranslation(message.guild.preferredLocale, 'MCPING::ERROR'))] })
      })
    })
  }
}
