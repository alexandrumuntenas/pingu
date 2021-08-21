const canvacord = require('canvacord')
const Downloader = require('nodejs-file-downloader')
const { MessageAttachment } = require('discord.js')
module.exports = {
  name: 'rank',
  execute (args, client, con, contenido, message, result) {
    let lan = require(`../../languages/${result[0].guild_language}.json`)
    const noavaliable = lan.tools.noavaliable
    lan = lan.tools.leveling.rank
    if (result[0].leveling_enabled !== 0) {
      const dif = result[0].leveling_rankup_difficulty
      const cache = { aspecto: result[0].leveling_rankup_image_background }
      if (message.mentions.users.first()) {
        if (message.mentions.users.first().bot) {
          message.channel.send(`<:win_information:876119543968305233> ${lan.isbot}`)
          return
        }
        con.query("SELECT * FROM `guild_levels` WHERE guild = '" + message.guild.id + "' AND user = '" + message.mentions.users.first().id + "'", (err, result) => {
          if (err) console.log(err)
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const experiencia = parseInt(result[0].experiencia)
            const nivel = parseInt(result[0].nivel)
            async function fa () {
              const avatar = new Downloader({
                url: message.mentions.users.first().avatarURL({ format: 'jpg' }),
                directory: './usuarios/avatares/',
                fileName: message.mentions.users.first().id + '_level.jpg',
                cloneFiles: false
              })
              try {
                await avatar.download()
                const rank = new canvacord.Rank()
                  .setAvatar('./usuarios/avatares/' + message.mentions.users.first().id + '_level.jpg')
                  .setCurrentXP(experiencia)
                  .setRequiredXP(((nivel * nivel) * dif) * 100)
                  .setStatus(message.mentions.users.first().presence.status, true)
                  .setLevel(nivel, lan.level)
                  .setProgressBar('#FFFFFF', 'COLOR')
                  .setUsername(message.mentions.users.first().username)
                  .setDiscriminator(message.mentions.users.first().discriminator)
                  .setRank(0, '', false)
                  .setBackground('IMAGE', './recursos/carteles/' + cache.aspecto + '.png')

                rank.build()
                  .then(buffer => {
                    canvacord.write(buffer, './usuarios/leveling/' + message.mentions.users.first().id + '_' + message.guild.id + '_rank.jpg')
                    const attachament = new MessageAttachment('./usuarios/leveling/' + message.mentions.users.first().id + '_' + message.guild.id + '_rank.jpg')
                    message.channel.send(attachament)
                  })
              } catch (e) {
                console.log(e)
              }
            }
            fa()
          } else {
            message.channel.send('<:pingu_cross:876104109256769546> No existen datos disponibles.')
          }
        })
      } else {
        con.query("SELECT * FROM `guild_levels` WHERE guild = '" + message.guild.id + "' AND user = '" + message.author.id + "'", (err, result) => {
          if (err) console.log(err)
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const experiencia = parseInt(result[0].experiencia)
            const nivel = parseInt(result[0].nivel)
            async function fa () {
              const avatar = new Downloader({
                url: message.author.avatarURL({ format: 'jpg' }),
                directory: './usuarios/avatares/',
                fileName: message.author.id + '_level.jpg',
                cloneFiles: false
              })
              try {
                await avatar.download()
                const rank = new canvacord.Rank()
                  .setAvatar('./usuarios/avatares/' + message.author.id + '_level.jpg')
                  .setCurrentXP(experiencia)
                  .setRequiredXP(((nivel * nivel) * dif) * 100)
                  .setStatus(message.author.presence.status, true)
                  .setLevel(nivel, lan.level)
                  .setProgressBar('#FFFFFF', 'COLOR')
                  .setUsername(message.author.username)
                  .setDiscriminator(message.author.discriminator)
                  .setRank(0, '', false)
                  .setBackground('IMAGE', './recursos/carteles/' + cache.aspecto + '.png')

                rank.build()
                  .then(buffer => {
                    canvacord.write(buffer, './usuarios/leveling/' + message.author.id + '_' + message.guild.id + '_rank.jpg')
                    const attachament = new MessageAttachment('./usuarios/leveling/' + message.author.id + '_' + message.guild.id + '_rank.jpg')
                    message.channel.send(attachament)
                  })
              } catch (e) {
                console.log(e)
              }
            }
            fa()
          } else {
            message.channel.send(`<:win_information:876119543968305233> ${lan.norank}`)
          }
        })
      };
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${noavaliable}`)
    }
  }
}
