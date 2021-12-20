const { SlashCommandBuilder } = require('@discordjs/builders')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice')
const RadioBrowser = require('radio-browser')
const { Success, Error } = require('../../modules/constructor/messageBuilder')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'radio',
  description: '📻 Play a radio station in a Discord VC',
  alias: [''],
  permissions: [],
  interactionData: new SlashCommandBuilder()
    .setName('radio')
    .setDescription('📻 Play a radio station in a Discord VC')
    .addStringOption(option => option.setName('station').setRequired(true).setDescription('The name of the radio station to play')),
  executeInteraction (client, locale, interaction) {
    RadioBrowser.searchStations({ name: interaction.options.getString('station'), nameExact: true, limit: 1 }).then(stations => {
      if (stations && Object.prototype.hasOwnProperty.call(stations, 0)) {
        const connection = joinVoiceChannel({
          channelId: interaction.member.voice.channel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator
        })
        const resource = createAudioResource(stations[0].url, { silencePaddingFrames: 120 })
        const player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop
          }
        })
        player.play(resource)
        const subscription = connection.subscribe(player)
        interaction.editReply({ embeds: [Success(getLocales(locale, 'RADIO_FOUND_PLAYING', { station: stations[0].name }))] })
      } else {
        interaction.editReply({ embeds: [Error(getLocales(locale, 'RADIO_NOTFOUND'))] })
      }
    })
  }
}
