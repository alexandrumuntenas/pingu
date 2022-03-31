const Gamedig = require('gamedig')
const { convertirMOTDaImagen, pingAEmoji, limpiarFormatoDeLosTextos } = require('../../modules/mcsrvstatus')
const { MessageAttachment, MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { plantillas } = require('../../functions/messageManager')

module.exports = {
  name: 'mcping',
  module: 'mcsrvstatus',
  description: '🖥️ Ping the configured Minecraft server',
  cooldown: 1,
  runInteraction (locale, interaction) {
    if (!interaction.guild.configuration.mcsrvstatus.host) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'MCPING::NO_HOST'))] })
    Gamedig.query({ type: 'minecraft', host: interaction.guild.configuration.mcsrvstatus.host, port: interaction.guild.configuration.mcsrvstatus.port ? interaction.guild.configuration.mcsrvstatus.port : 25565 }).then((state) => {
      convertirMOTDaImagen(state.raw.vanilla.raw.description.extra, motd => {
        const attachment = new MessageAttachment(motd, 'motd.png')
        const embed = new MessageEmbed()
          .addField(':radio_button: Version', limpiarFormatoDeLosTextos(state.raw.vanilla.raw.version.name) || 'Unknown version', true)
          .addField(':busts_in_silhouette: Players', `${state.raw.vanilla.raw.players.online} / ${state.raw.vanilla.raw.players.max}`, true)
          .addField(`${pingAEmoji(state.raw.vanilla.ping)} Ping`, `${state.raw.vanilla.ping}ms` || 'Failed to fetch server ping', true)
          .addField(':desktop: Address', state.connect, false)
          .setImage('attachment://motd.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

        interaction.editReply({ files: [attachment], embeds: [embed] })
      })
    }).catch(() => {
      interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'MCPING::ERROR'))] })
    })
  },
  runCommand (locale, message) {
    if (!message.guild.configuration.mcsrvstatus.host) return message.reply({ embeds: [plantillas.error(i18n(locale, 'MCPING::NO_HOST'))] })
    message.reply({ embeds: [plantillas.precargador(i18n(locale, 'OBTAININGDATA'))] }).then(_message => {
      Gamedig.query({ type: 'minecraft', host: message.guild.configuration.mcsrvstatus.host, port: message.guild.configuration.mcsrvstatus.port ? message.guild.configuration.mcsrvstatus.port : 25565 }).then((state) => {
        _message.edit({ embeds: [plantillas.precargador(i18n(locale, 'PROCESSINGDATA'))] })
        convertirMOTDaImagen(state.raw.vanilla.raw.description.extra, motd => {
          const attachment = new MessageAttachment(motd, 'motd.png')
          const embed = new MessageEmbed()
            .addField(':radio_button: Version', limpiarFormatoDeLosTextos(state.raw.vanilla.raw.version.name) || 'Unknown version', true)
            .addField(':busts_in_silhouette: Players', `${state.raw.vanilla.raw.players.online} / ${state.raw.vanilla.raw.players.max}`, true)
            .addField(`${pingAEmoji(state.raw.vanilla.ping)} Ping`, `${state.raw.vanilla.ping}ms` || 'Failed to fetch server ping', true)
            .addField(':desktop: Address', state.connect, false)
            .setImage('attachment://motd.png')
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

          _message.edit({ files: [attachment], embeds: [embed] })
        })
      }).catch(() => {
        _message.edit({ embeds: [plantillas.conexito(i18n(locale, 'MCPING::ERROR'))] })
      })
    })
  }
}
