const fetch = require('superagent')
const getLocales = require('../../i18n/getLocales')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'lizard',
  description: '🦎 Sends a random lizard image',
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    function sendImageEmbed (url, provider) {
      const embed = new MessageEmbed()
        .setImage(url.url).setDescription(`<a:ultimahora:876105976573472778> ${getLocales(locale, 'ANIME_IMAGE_API', { API_PROVIDER: provider })}`)
      interaction.editReply({ embeds: [embed] })
    }
    fetch('https://nekos.life/api/v2/img/lizard')
      .then((response) => response.body)
      .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
  },
  executeLegacy (client, locale, message) {
    function sendImageEmbed (url, provider) {
      const embed = new MessageEmbed()
        .setImage(url.url).setDescription(`<a:ultimahora:876105976573472778> ${getLocales(locale, 'ANIME_IMAGE_API', { API_PROVIDER: provider })}`)
      message.reply({ embeds: [embed] })
    }
    fetch('https://nekos.life/api/v2/img/lizard')
      .then((response) => response.body)
      .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
  }
}
