const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const messageBuilder = require('../../modules/constructor/messageBuilder')

module.exports = {
  module: 'levels',
  cooldown: 10000,
  name: 'levelstop',
  description: '🏅 Get the leaderboard',
  executeInteraction (client, locale, interaction) {
    if (interaction.database.levelsEnabled !== 0) {
      client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC LIMIT 10', [interaction.guild.id], (err, rows, result) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
        if (rows) {
          if (Object.prototype.hasOwnProperty.call(rows, 0)) {
            const embed = new MessageEmbed()
              .setTitle(`:trophy: ${i18n(locale, 'LEVELSTOP_TITLE')}`)
              .setFooter(interaction.guild.name)
              .setColor('#FFD700')

            let count = 0
            rows.forEach(function (row) {
              client.users.fetch(row.member).then((user) => {
                count++
                embed.addFields({ name: `${user.username}#${user.discriminator}`, value: `${i18n(locale, 'LEVELSTOP_ENTRY', { LEVEL: row.memberLevel, XP: row.memberExperience })}` })
                if (count === rows.length) {
                  interaction.editReply({ embeds: [embed] })
                }
              })
            })
          } else {
            messageBuilder.error(interaction, locale, 'LEVELSTOP_NODATA')
          };
        }
      })
    } else {
      messageBuilder.error.noavaliable(interaction, locale)
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC LIMIT 10', [message.guild.id], (err, rows, result) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
        if (rows) {
          if (Object.prototype.hasOwnProperty.call(rows, 0)) {
            const embed = new MessageEmbed()
              .setTitle(`:trophy: ${i18n(locale, 'LEVELSTOP_TITLE')}`)
              .setFooter(message.guild.name)
              .setColor('#FFD700')

            let count = 0
            rows.forEach(function (row) {
              client.users.fetch(row.member).then((user) => {
                count++
                embed.addFields({ name: `${user.username}#${user.discriminator}`, value: `${i18n(locale, 'LEVELSTOP_ENTRY', { LEVEL: row.memberLevel, XP: row.memberExperience })}` })
                if (count === rows.length) {
                  message.channel.send({ embeds: [embed] })
                }
              })
            })
          } else {
            messageBuilder.legacy.error(message, locale, 'LEVELSTOP_NODATA')
          };
        }
      })
    } else {
      messageBuilder.legacy.error.noavaliable(message, locale)
    }
  }
}
