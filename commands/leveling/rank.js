const canvacord = require('canvacord')
const Downloader = require('nodejs-file-downloader')
const { MessageAttachment } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'rank',
  execute (client, locale, message) {
    if (message.database.leveling_enabled !== 0) {
      if (message.mentions.users.first()) {
        if (message.mentions.users.first().bot) {
          genericMessages.Error.customerror(message, locale, 'RANK_IS_A_BOT')
          return
        }
        client.pool.query('SELECT * FROM `guildLevels` WHERE guild = ? AND user = ?', [message.guild.id, message.mentions.users.first().id], (err, result) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const experiencia = parseInt(result[0].experiencia)
            const nivel = parseInt(result[0].nivel)
            const avatar = new Downloader({
              url: message.mentions.users.first().displayAvatarURL({ format: 'jpg', size: 512 }),
              directory: './usuarios/avatares/',
              fileName: `${message.mentions.users.first().id}_level.jpg`,
              cloneFiles: false
            })
            try {
              avatar.download()
              const rank = new canvacord.Rank()
                .setAvatar(`./usuarios/avatares/${message.mentions.users.first().id}_level.jpg`)
                .setCurrentXP(experiencia)
                .setRequiredXP(((nivel * nivel) * message.database.leveling_rankup_difficulty) * 100)
                .setStatus(message.guild.members.cache.get(message.mentions.users.first().id).presence.status || 'offline', false)
                .setLevel(nivel, getLocales(locale, 'RANK_LEVEL'))
                .setProgressBar('#FFFFFF', 'COLOR')
                .setUsername(message.mentions.users.first().username)
                .setDiscriminator(message.mentions.users.first().discriminator)
                .setRank(0, '', false)
                .setBackground('IMAGE', `./modules/sources/defaultBackgrounds/${message.database.leveling_rankup_image_background}.png`)

              rank.build()
                .then(buffer => {
                  canvacord.write(buffer, `./usuarios/leveling/${message.mentions.users.first().id}_${message.guild.id}_rank.jpg`)
                  const attachament = new MessageAttachment(`./usuarios/leveling/${message.mentions.users.first().id}_${message.guild.id}_rank.jpg`)
                  message.reply({ files: [attachament] })
                })
            } catch (err) {
              client.Sentry.captureException(err)
              client.log.error(err)
            }
          } else {
            genericMessages.Error.customerror(message, locale, 'RANK_NO_CLASSIFIED_MENTIONED')
          }
        })
      } else {
        client.pool.query('SELECT * FROM `guildLevels` WHERE guild = ? AND user = ?', [message.guild.id, message.author.id], (err, result) => {
          if (err) {
            client.Sentry.captureException(err)
            client.log.error(err)
          }
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const experiencia = parseInt(result[0].experiencia)
            const nivel = parseInt(result[0].nivel)
            const avatar = new Downloader({
              url: message.author.displayAvatarURL({ format: 'jpg', size: 512 }),
              directory: './usuarios/avatares/',
              fileName: `${message.author.id}_level.jpg`,
              cloneFiles: false
            })
            try {
              avatar.download()
              const rank = new canvacord.Rank()
                .setAvatar(`./usuarios/avatares/${message.author.id}_level.jpg`)
                .setCurrentXP(experiencia)
                .setRequiredXP(((nivel * nivel) * message.database.leveling_rankup_difficulty) * 100)
                .setStatus(message.member.presence.status || 'offline', false)
                .setLevel(nivel, getLocales(locale, 'RANK_LEVEL'))
                .setProgressBar('#FFFFFF', 'COLOR')
                .setUsername(message.author.username)
                .setDiscriminator(message.author.discriminator)
                .setRank(0, '', false)
                .setBackground('IMAGE', `./modules/sources/defaultBackgrounds/${message.database.leveling_rankup_image_background}.png`)

              rank.build()
                .then(buffer => {
                  canvacord.write(buffer, `./usuarios/leveling/${message.author.id}_${message.guild.id}_rank.jpg`)
                  const attachament = new MessageAttachment(`./usuarios/leveling/${message.author.id}_${message.guild.id}_rank.jpg`)
                  message.reply({ files: [attachament] })
                })
            } catch (err) {
              client.Sentry.captureException(err)
              client.log.error(err)
            }
          } else {
            genericMessages.Error.customerror(message, locale, 'RANK_NO_CLASSIFIED')
          }
        })
      };
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
