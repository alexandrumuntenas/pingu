const fetch = require('superagent')
const { MessageEmbed } = require('discord.js')
const translate = require('translatte')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'nasa',
  description: '🚀 Get the NASA\'s image of the day',
  cooldown: 0,
  executeInteraction (client, locale, interaction) {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`)
      .then(response => response.body)
      .then(quote => {
        translate(quote.explanation, { to: interaction.database.guildLanguage }).then(res => {
          if (quote.media_type === 'image') {
            const embed = new MessageEmbed()
              .setTitle(quote.title)
              .setDescription(res.text)
              .setImage(quote.hdurl)
              .setColor('#0B3D91')
              .addField('+ Info', `:camera: ${quote.copyright || 'We don\'t have that information'}\n<a:ultimahora:876105976573472778> ${i18n(locale, 'ANIME_IMAGE_API', { API_PROVIDER: 'Nasa.gov' })}`)
              .setFooter('')
            interaction.editReply({ embeds: [embed] })
          } else {
            interaction.editReply('We are working on video media type.')
          }
        })
      })
  },
  executeLegacy (client, locale, message) {
    message.reply('<a:loader:871389840904695838>')
      .then(msg => {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`)
          .then(response => response.body)
          .then(quote => {
            translate(quote.explanation, { to: message.database.guildLanguage }).then(res => {
              if (quote.media_type === 'image') {
                const embed = new MessageEmbed()
                  .setTitle(quote.title)
                  .setDescription(res.text)
                  .setImage(quote.hdurl)
                  .setColor('#0B3D91')
                  .addField('+ Info', `:camera: ${quote.copyright || 'We don\'t have that information'}\n<a:ultimahora:876105976573472778> ${i18n(locale, 'ANIME_IMAGE_API', { API_PROVIDER: 'Nasa.gov' })}`)
                  .setFooter('')
                msg.edit({ content: 'Done!', embeds: [embed] })
              } else {
                message.channel.send('We are working on video media type.')
              }
            })
          })
      })
  }
}
