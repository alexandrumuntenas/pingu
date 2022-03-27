const Gamedig = require('gamedig')
const { convertirMOTDaImagen, pingAEmoji } = require('../../modules/mcsrvstatus')
const { MessageAttachment, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'mcping',
  // module: 'mcsrvstatus',
  description: '🏅 Get your rank',
  cooldown: 1,
  runInteraction (locale, interaction) {

  },
  runCommand (locale, message) {
    Gamedig.query({ type: 'minecraft', host: message.guild.configuration.mcsrvstatus.host, port: message.guild.configuration.mcsrvstatus.port ? message.guild.configuration.mcsrvstatus.port : 25565 }).then((state) => {
      convertirMOTDaImagen(state.raw.vanilla.raw.description.extra, motd => {
        const attachment = new MessageAttachment(motd, 'motd.png')
        const embed = new MessageEmbed()
          .addField(':radio_button: Version', state.raw.vanilla.raw.version.name || 'Unknown version', true)
          .addField(':busts_in_silhouette: Players', `${state.raw.vanilla.raw.players.online} / ${state.raw.vanilla.raw.players.max}`, true)
          .addField(`${pingAEmoji(state.raw.vanilla.ping)} Ping`, `${state.raw.vanilla.ping}ms` || 'Failed to fetch server ping', true)
          .addField(':desktop: Address', state.connect, false)
          .setImage('attachment://motd.png')

        message.reply({ files: [attachment], embeds: [embed] })
      })
    }).catch((error) => {
      message.reply(error.message)
    })
  }
}
