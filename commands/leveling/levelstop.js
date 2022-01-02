const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { Error } = require('../../modules/constructor/messageBuilder')

module.exports = {
  module: 'levels',
  cooldown: 10000,
  name: 'levelstop',
  description: '🏅 Get the leaderboard',
  executeInteraction (client, locale, interaction) {
    if (interaction.database.levelsEnabled !== 0) {
      client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC LIMIT 10', [interaction.guild.id], (err, rows, result) => {
        if (err) {
          client.logError(err)
          client.log.error(err)
        }
        if (rows) {
          if (Object.prototype.hasOwnProperty.call(rows, 0)) {
            const embed = new MessageEmbed()
              .setTitle(`:trophy: ${i18n(locale, 'RANKING')}`)
              .setFooter(interaction.guild.name)
              .setColor('#FFD700')

            let leaderboardStr = ''
            let count = 0
            rows.forEach(function (row) {
              client.users.fetch(row.member).then((user) => {
                count++
                leaderboardStr = `${leaderboardStr}\n#${count}. **${user.username}#${user.discriminator}** (${i18n(locale, 'LEVEL')}: ${row.memberLevel}, ${i18n(locale, 'EXPERIENCE')} ${row.memberExperience}) `
                if (count === rows.length) {
                  interaction.editReply({ embeds: [embed.setDescription(leaderboardStr)] })
                }
              })
            })
          } else {
            interaction.editReply({ embeds: [Error(locale, 'LEVELSTOP::NODATA')] })
          };
        }
      })
    } else {
      interaction.editReply({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC LIMIT 10', [message.guild.id], (err, rows, result) => {
        if (err) {
          client.logError(err)
          client.log.error(err)
        }
        if (rows) {
          if (Object.prototype.hasOwnProperty.call(rows, 0)) {
            const embed = new MessageEmbed()
              .setTitle(`:trophy: ${i18n(locale, 'RANKING')}`)
              .setFooter(message.guild.name)
              .setColor('#FFD700')

            let leaderboardStr = ''
            let count = 0
            rows.forEach(function (row) {
              client.users.fetch(row.member).then((user) => {
                count++
                leaderboardStr = `${leaderboardStr}\n#${count}. **${user.username}#${user.discriminator}** (${i18n(locale, 'LEVEL')}: ${row.memberLevel}, ${i18n(locale, 'EXPERIENCE')} ${row.memberExperience}) `
                if (count === rows.length) {
                  message.channel.send({ embeds: [embed.setDescription(leaderboardStr)] })
                }
              })
            })
          } else {
            message.channel.send({ embeds: [Error(locale, 'LEVELSTOP::NODATA')] })
          };
        }
      })
    } else {
      message.channel.send({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] })
    }
  }
}
