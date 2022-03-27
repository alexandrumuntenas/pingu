const Gamedig = require('gamedig')
const { convertirMOTDaImagen, pingAEmoji } = require('../../modules/mcsrvstatus')
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
    Gamedig.query({ type: 'minecraft', host: interaction.options.getString('ip_or_address'), port: interaction.options.getString('port') ? interaction.options.getString('port') : 25565 }).then((state) => {
      convertirMOTDaImagen(state.raw.vanilla.raw.description.extra || state.raw.vanilla.raw.description || state.name, motd => {
        const attachment = new MessageAttachment(motd, 'motd.png')
        const embed = new MessageEmbed()
          .addField(':radio_button: Version', state.raw.vanilla.raw.version.name || 'Unknown version', true)
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
    if (!Object.prototype.hasOwnProperty.call(message.parameters, 0)) message.reply({ embeds: plantillas.ayuda() })
    Gamedig.query({ type: 'minecraft', host: message.guild.configuration.mcsrvstatus.host, port: message.guild.configuration.mcsrvstatus.port ? message.guild.configuration.mcsrvstatus.port : 25565 }).then((state) => {
      convertirMOTDaImagen(state.raw.vanilla.raw.description.extra || state.raw.vanilla.raw.description || state.name, motd => {
        const attachment = new MessageAttachment(motd, 'motd.png')
        const embed = new MessageEmbed()
          .addField(':radio_button: Version', state.raw.vanilla.raw.version.name || 'Unknown version', true)
          .addField(':busts_in_silhouette: Players', `${state.raw.vanilla.raw.players.online} / ${state.raw.vanilla.raw.players.max}`, true)
          .addField(`${pingAEmoji(state.raw.vanilla.ping)} Ping`, `${state.raw.vanilla.ping}ms` || 'Failed to fetch server ping', true)
          .addField(':desktop: Address', state.connect, false)
          .setImage('attachment://motd.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()

        message.reply({ files: [attachment], embeds: [embed] })
      })
    }).catch(() => {
      message.reply({ embeds: [plantillas.conexito(i18n(locale, 'MCPING::ERROR'))] })
    })
  }
}
