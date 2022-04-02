const { obtenerDatosDelServidor } = require('../../modules/mcsrvstatus')
const { MessageAttachment, MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { plantillas } = require('../../functions/messageManager')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'mcserver',
  module: 'mcsrvstatus',
  description: '🖥️ Ping a specified Minecraft server',
  interactionData: new SlashCommandBuilder().addStringOption(input => input.setName('ip_or_address').setRequired(true).setDescription('The IP or address of the server')).addStringOption(input => input.setName('port').setDescription('The port of the server')),
  cooldown: 1,
  runInteraction (locale, interaction) {
    obtenerDatosDelServidor({ ip: interaction.options.getString('ip_or_address'), port: interaction.options.getString('port') }, datosDelServidor => {
      if (datosDelServidor) {
        const attachment = new MessageAttachment(datosDelServidor.motd, 'motd.png')
        const embed = new MessageEmbed()
          .addField(':radio_button: Version', datosDelServidor.version, true)
          .addField(':busts_in_silhouette: Players', datosDelServidor.jugadores, true)
          .addField(`${datosDelServidor.ping.emoji} Ping`, `${datosDelServidor.ping.ms}ms` || 'Failed to fetch server ping', true)
          .addField(':desktop: Address', datosDelServidor.direccion, false)
          .setImage('attachment://motd.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

        interaction.editReply({ files: [attachment], embeds: [embed] })
      } else {
        return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'MCPING::ERROR'))] })
      }
    })
  },
  runCommand (locale, message) {
    try {
      obtenerDatosDelServidor({})
    } catch {
      message.reply({ embeds: [plantillas.error(i18n(locale, 'MCPING::ERROR'))] })
    }
  }
}
