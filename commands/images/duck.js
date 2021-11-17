const fetch = require('superagent')
const getLocales = require('../../i18n/getLocales')
const { MessageEmbed } = require('discord.js')

module.exports = {
  cooldown: 0,
  name: 'duck',
  execute (client, locale, message) {
    function sendImageEmbed (url, provider) {
      const embed = new MessageEmbed()
        .setImage(url.url).setDescription(`<a:ultimahora:876105976573472778> ${getLocales(locale, 'ANIME_IMAGE_API', { API_PROVIDER: provider })}`)
      message.reply({ embeds: [embed] })
    }
    fetch('https://random-d.uk/api/v2/random')
      .then((response) => response.body)
      .then((fetched) => sendImageEmbed(fetched, 'Random-d.uk'))
  }
}
