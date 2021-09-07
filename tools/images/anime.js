const { MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')
const noNSFWonSFW = require('../../modules/noNSFWonSFW')
const fetch = require('superagent')

const commandSFWCategory = ['quote', 'hug', 'cuddle', 'kiss', 'pat', 'slap', 'smug', 'baka', 'tickle', 'poke', 'neko', 'nekoGif', 'foxGirl', 'feed', 'kemonomimi', 'holo', 'wallpaper', 'gecg', 'avatar', 'waifu']
const commandNSFWCategory = ['waifu', 'randomHentaiGif', 'pussy', 'nsfwNekoGif', 'nsfwNeko', 'lesbian', 'kuni', 'cumSluts', 'classic', 'boobs', 'bJ', 'anal', 'nsfwAvatar', 'yuri', 'trap', 'tits', 'soloGirlGif', 'pussyWankGif', 'pussyArt', 'nsfwKemonomimi', 'kitsune', 'keta', 'nsfwHolo', 'holoEro', 'hentai', 'futanari', 'fendom', 'feetGif', 'eroFeet', 'feet', 'ero', 'eroKitsune', 'eroKemonomimi', 'eroNeko', 'eroYuri', 'cumArts', 'blowjob', 'spank', 'gasm']

module.exports = {
  name: 'anime',
  execute (client, locale, message, result) {
    function sendImageEmbed (url, provider) {
      const embed = new MessageEmbed()
        .setImage(url.url).setDescription(`<a:ultimahora:876105976573472778> ${getLocales(locale, 'ANIME_IMAGE_API', { API_PROVIDER: provider })}`)
      message.reply({ embeds: [embed] })
    }
    if (Object.prototype.hasOwnProperty.call(message.args, 0)) {
      switch (message.args[0]) {
        case 'quote': {
          function quoteEmbed (quote) {
            const embed = new MessageEmbed()
              .setAuthor(`${quote.character} • ${quote.anime}`)
              .setDescription(`${quote.quote}\n\n<a:ultimahora:876105976573472778> Quotes via the API of \`animechan\``)
            message.reply({ embeds: [embed] })
          }
          fetch('https://animechan.vercel.app/api/random')
            .then((response) => response.body)
            .then((quote) => quoteEmbed(quote))
          break
        }
        case 'hug': {
          fetch('https://nekos.life/api/v2/img/hug')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'cuddle': {
          fetch('https://nekos.life/api/v2/img/cuddle')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'kiss': {
          fetch('https://nekos.life/api/v2/img/kiss')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'pat': {
          fetch('https://nekos.life/api/v2/img/pat')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'slap': {
          fetch('https://nekos.life/api/v2/img/slap')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'smug': {
          fetch('https://nekos.life/api/v2/img/smug')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'baka': {
          fetch('https://nekos.life/api/v2/img/baka')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'tickle': {
          fetch('https://nekos.life/api/v2/img/tickle')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'poke': {
          fetch('https://nekos.life/api/v2/img/poke')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'neko': {
          fetch('https://nekos.life/api/v2/img/neko')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'nekoGif': {
          fetch('https://nekos.life/api/v2/img/ngif')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'foxGirl': {
          fetch('https://nekos.life/api/v2/img/fox_girl')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'feed': {
          fetch('https://nekos.life/api/v2/img/feed')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'kemonomimi': {
          fetch('https://nekos.life/api/v2/img/kemonomimi')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'holo': {
          fetch('https://nekos.life/api/v2/img/holo')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'wallpaper': {
          fetch('https://nekos.life/api/v2/img/wallpaper')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }

        case 'goose': {
          fetch('https://nekos.life/api/v2/img/goose')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'gecg': {
          fetch('https://nekos.life/api/v2/img/gecg')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'avatar': {
          fetch('https://nekos.life/api/v2/img/avatar')
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          break
        }
        case 'waifu':
          fetch(`https://waifu.pics/api/${message.channel.nsfw ? 'nsfw' : 'sfw'}/waifu`)
            .then((response) => response.body)
            .then((fetched) => sendImageEmbed(fetched, 'waifu.pics'))
          break
        case 'randomHentaiGif': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/Random_hentai_gif')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'pussy': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/pussy')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'nsfwNekoGif': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/nsfw_neko_gif')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'nsfwNeko': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/lewd')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'lesbian': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/les')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'kuni': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/kuni')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'cumSluts': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/cum')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'classic': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/classic')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'boobs': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/boobs')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'bJ': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/bj')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'anal': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/anal')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'nsfwAvatar': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/nsfw_avatar')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'yuri': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/yuri')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'trap': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/trap')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'tits': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/tits')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'soloGirlGif': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/solog')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'soloGirl': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/solo')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'pussyWankGif': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/pwankg')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'pussyArt': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/pussy_jpg')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'nsfwKemonomimi': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/lewdkemo')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'kitsune': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/lewdk')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'keta': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/lewdk')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'nsfwHolo': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/hololewd')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'holoEro': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/holoero')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'hentai': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/hentai')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'futanari': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/futanari')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'femdom': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/femdom')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'feetGif': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/feetg')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'eroFeet': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/erofeet')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'feet': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/feet')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'ero': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/ero')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'eroKitsune': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/erok')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'eroKemonomimi': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/erokemo')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'eroNeko': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/eron')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'eroYuri': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/eroyuri')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'cumArts': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/cum_jpg')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'blowjob': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/blowjob')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'spank': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/spank')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        case 'gasm': {
          if (message.channel.nsfw) {
            fetch('https://nekos.life/api/v2/img/gasm')
              .then((response) => response.body)
              .then((fetched) => sendImageEmbed(fetched, 'nekos.life'))
            break
          } else if (result[0].moderator_noNsfwOnSfw_enabled === 1) {
            noNSFWonSFW(result[0].moderator_noNsfwOnSfw_action, result[0].moderator_noNsfwOnSfw_message, message, con)
          }
          break
        }
        default: {
          if (!message.channel.nsfw) {
            genericMessages.Info.help(message, locale, `${result[0].guild_prefix}anime <category>`, commandSFWCategory, false)
          } else {
            genericMessages.Info.help(message, locale, `${result[0].guild_prefix}anime <category>`, commandSFWCategory, true, commandNSFWCategory)
          }
          break
        }
      }
    } else {
      if (!message.channel.nsfw) {
        genericMessages.Info.help(message, locale, `${result[0].guild_prefix}anime <category>`, commandSFWCategory, false)
      } else {
        genericMessages.Info.help(message, locale, `${result[0].guild_prefix}anime <category>`, commandSFWCategory, true, commandNSFWCategory)
      }
    }
  }
}
