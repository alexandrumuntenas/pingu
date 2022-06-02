import Client from "../../client"

const fetch = require('superagent')
const { EmbedBuilder } = require('discord.js')
const i18n = require('../../core/i18nManager')
const { plantillas } = require('../../core/messageManager')

module.exports = {
  name: 'nasa',
  description: '🚀 Get the NASA\'s image of the day',
  cooldown: 1,
  runInteraction (interaction) {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`)
      .then(response => response.body)
      .then(resource => {
        const embed = new EmbedBuilder()
          .setTitle('Astronomy Picture of The Day')
          .setDescription(resource.explanation)
          .setAuthor({ name: 'NASA', url: 'https://nasa.gov', iconURL: 'https://cdn.discordapp.com/attachments/908413370665938975/939841209629822986/nasa-logo.png' })
          .setFooter({ text: 'Powered by Pingu', iconURL: Client.user.displayAvatarURL() })
          .setTimestamp(resource.date)
          .setURL(`https://apod.nasa.gov/apod/ap${resource.date.slice(2).replace('-', '').replace('-', '')}.html`)
          .setColor('#0B3D91')

        if (resource.media_type === 'image') {
          embed
            .setTitle(resource.title)
            .setImage(resource.hdurl)
            .addFields([
              {
                name: '+ Info', value: `<:blurple_image:892443053359517696> ${resource.copyright || i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'IMAGEAPI::NOCOPYRIGHT')}\n<a:ultimahora:876105976573472778> ${i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'IMAGEAPI::PROVIDER', { PROVIDER: 'Nasa.gov' })}`, inline: true
              }
            ])
          interaction.editReply({ embeds: [embed] })
        } else {
          interaction.editReply({ embeds: [embed] })
        }
      })
  },
  runCommand (message) {
    message
      .reply({ embeds: [plantillas.precargador(i18n.obtenerTraduccion(message.guild.preferredLocale, 'FETCHINGDATA'))] })
      .then(msg => {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_KEY}`)
          .then(response => response.body)
          .then(resource => {
            const embed = new EmbedBuilder()
              .setTitle('Astronomy Picture of The Day')
              .setDescription(resource.explanation)
              .setAuthor({ name: 'NASA', url: 'https://nasa.gov', iconURL: 'https://cdn.discordapp.com/attachments/908413370665938975/939841209629822986/nasa-logo.png' })
              .setFooter({ text: 'Powered by Pingu', iconURL: Client.user.displayAvatarURL() })
              .setTimestamp(resource.date)
              .setURL(`https://apod.nasa.gov/apod/ap${resource.date.slice(2).replace('-', '').replace('-', '')}.html`)
              .setColor('#0B3D91')

            if (resource.media_type === 'image') {
              embed
                .setTitle(resource.title)
                .setImage(resource.hdurl)
                .addFields([
                  { name: '+ Info', value: `<:blurple_image:892443053359517696> ${resource.copyright || i18n.obtenerTraduccion(message.guild.preferredLocale, 'IMAGEAPI::NOCOPYRIGHT')}\n<a:ultimahora:876105976573472778> ${i18n.obtenerTraduccion(message.guild.preferredLocale, 'IMAGEAPI::PROVIDER', { PROVIDER: 'Nasa.gov' })}`, inline: true }
                ])
              msg.edit({ embeds: [embed] })
            } else {
              msg.edit({ embeds: [embed] })
            }
          })
      })
  }
}
