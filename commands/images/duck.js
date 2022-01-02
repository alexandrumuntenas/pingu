const fetch = require('superagent')
const i18n = require('../../i18n/i18n')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'duck',
  description: '🦆 Sends a random duck image',
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    function sendImageEmbed (url, provider) {
      const embed = new MessageEmbed()
        .setImage(url.url).setDescription(`<a:ultimahora:876105976573472778> ${i18n(locale, 'IMAGEAPI::PROVIDER', { API: provider })}`)
      interaction.editReply({ embeds: [embed] })
    }
    fetch('https://random-d.uk/api/v2/random')
      .then((response) => response.body)
      .then((fetched) => sendImageEmbed(fetched, 'Random-d.uk'))
  },
  executeLegacy (client, locale, message) {
    function sendImageEmbed (url, provider) {
      const embed = new MessageEmbed()
        .setImage(url.url).setDescription(`<a:ultimahora:876105976573472778> ${i18n(locale, 'ANIME_IMAGE_API', { API_PROVIDER: provider })}`)
      message.reply({ embeds: [embed] })
    }
    fetch('https://random-d.uk/api/v2/random')
      .then((response) => response.body)
      .then((fetched) => sendImageEmbed(fetched, 'Random-d.uk'))
  }
}
