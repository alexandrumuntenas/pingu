const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')
const noNSFWonSFW = require('../../modules/noNSFWonSFW')
const fetch = require('superagent')
const animeProviderList = require('./anime.providerlist.json')

module.exports = {
  name: 'anime',
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Check out this command')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('The category you want to fetch')
    ),
  execute (client, locale, message, isInteraction) {
    if (!isInteraction) {
      if (Object.prototype.hasOwnProperty.call(message.args, 0)) {
        const provider = animeProviderList.find(provider => provider.option === message.args[0])
        if (provider) {
          if (provider.nsfw === true && !message.channel.nsfw) {
            if (message.database.moderator_noNsfwOnSfw_enabled === 1) {
              noNSFWonSFW(client, message, { actionToTake: message.database.moderator_noNsfwOnSfw_action, messageToSend: message.database.moderator_noNsfwOnSfw_message })
              return
            }
          }
          fetchData(message, locale, provider, false)
        } else {
          helpMessage(message, locale, false)
        }
      } else {
        helpMessage(message, locale, false)
      }
    } else {
      if (message.options.getString('category')) {
        const provider = animeProviderList.find(provider => provider.option === message.options.getString('category'))
        if (provider) {
          if (provider.nsfw === true && !message.channel.nsfw) {
            if (message.database.moderator_noNsfwOnSfw_enabled === 1) {
              noNSFWonSFW(client, message, { actionToTake: message.database.moderator_noNsfwOnSfw_action, messageToSend: message.database.moderator_noNsfwOnSfw_message })
              return
            }
          }
          fetchData(message, locale, provider, true)
        } else {
          helpMessage(message, locale, true)
        }
      } else {
        helpMessage(message, locale, true)
      }
    }
  }
}

function helpMessage (message, locale, ephemeral) {
  genericMessages.Info.help(message, locale, `${message.database.guild_prefix}anime <category>`, animeProviderList.filter(object => object.nsfw === false), animeProviderList.filter(object => object.nsfw === true), ephemeral)
}

function fetchData (message, locale, provider, ephemeral) {
  const sentMessage = new MessageEmbed()

  try {
    fetch(provider.endpoint).then((response) => response.body).then((fetched) => {
      switch (provider.type) {
        case 'quote': {
          sentMessage
            .setAuthor(`${fetched.character} • ${fetched.anime}`)
            .setDescription(`${fetched.quote}\n\n<a:ultimahora:876105976573472778> Quotes via the API of animechan`)
          sendMessage(message, sentMessage, ephemeral)
          break
        }
        case 'image': {
          const sourceURL = new URL(provider.endpoint).hostname
          sentMessage
            .setImage(fetched.url).setDescription(`<a:ultimahora:876105976573472778> ${getLocales(locale, 'ANIME_IMAGE_API', { API_PROVIDER: sourceURL })}`)
          sendMessage(message, sentMessage, ephemeral)
          break
        }
      }
    })
  } catch (err) {
    return err
  }
}

function sendMessage (message, sentMessage, ephemeral) {
  if (ephemeral === false) {
    message.reply({ embeds: [sentMessage] })
  } else {
    message.editReply({ embeds: [sentMessage], ephemeral: true })
  }
}
