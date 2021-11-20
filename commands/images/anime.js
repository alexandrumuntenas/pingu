const { MessageEmbed } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const fetch = require('superagent')
const animeProviderList = require('./anime.providerlist.json')

module.exports = {
  cooldown: 0,
  name: 'anime',
  executeLegacy (client, locale, message) {
    if (Object.prototype.hasOwnProperty.call(message.args, 0)) {
      const provider = animeProviderList.find(provider => provider.option === message.args[0])
      if (provider) {
        if (!message.channel.nsfw && provider.nsfw === true) {
          return
          /* if (message.database.moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(client, message, { actionToTake: message.database.moderator_noNsfwOnSfw_action, messageToSend: message.database.moderator_noNsfwOnSfw_message })
            return
          } */
        }
        const sentMessage = new MessageEmbed()
        try {
          fetch(provider.endpoint).then((response) => response.body).then((fetched) => {
            switch (provider.type) {
              case 'quote': {
                sentMessage
                  .setAuthor(`${fetched.character} • ${fetched.anime}`)
                  .setDescription(`${fetched.quote}\n\n<a:ultimahora:876105976573472778> Quotes via the API of animechan`)
                message.reply({ embeds: [sentMessage] })
                break
              }
              case 'image': {
                const sourceURL = new URL(provider.endpoint).hostname
                sentMessage
                  .setImage(fetched.url).setDescription(`<a:ultimahora:876105976573472778> ${getLocales(locale, 'ANIME_IMAGE_API', { API_PROVIDER: sourceURL })}`)
                message.reply({ embeds: [sentMessage] })
                break
              }
            }
          })
        } catch (err) {
          return err
        }
      } else {
        if (!message.channel.nsfw) {
          genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}anime <category>`, animeProviderList.filter(object => object.nsfw === false), false)
        } else {
          genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}anime <category>`, animeProviderList.filter(object => object.nsfw === false), true, animeProviderList.filter(object => object.nsfw === true))
        }
      }
    } else {
      if (!message.channel.nsfw) {
        genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}anime <category>`, animeProviderList.filter(object => object.nsfw === false), false)
      } else {
        genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}anime <category>`, animeProviderList.filter(object => object.nsfw === false), true, animeProviderList.filter(object => object.nsfw === true))
      }
    }
  }
}
