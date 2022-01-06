const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { Error } = require('../../modules/constructor/messageBuilder')
const { getLeaderboard } = require('../../modules/levels')

module.exports = {
  module: 'levels',
  cooldown: 10000,
  name: 'levelstop',
  description: '🏅 Get the leaderboard',
  executeInteraction (client, locale, interaction) {
    if (interaction.database.levelsEnabled !== 0) {
      getLeaderboard(client, interaction.guild, (members) => {
        if (members) {
          const embed = new MessageEmbed()
            .setTitle(`:trophy: ${i18n(locale, 'RANKING')} TOP 25`)
            .setFooter(interaction.guild.name)
            .setColor('#FFD700')

          let leaderboardStr = ''
          let count = 0
          members.forEach(function (row) {
            client.users.fetch(row.member).then((user) => {
              count++
              leaderboardStr = `${leaderboardStr}\n#${count}. **${user.username}#${user.discriminator}** (${i18n(locale, 'LEVEL')}: ${row.memberLevel}, ${i18n(locale, 'EXPERIENCE')} ${row.memberExperience}) `
              if (count === members.length) {
                interaction.editReply({ embeds: [embed.setDescription(leaderboardStr)] })
              }
            })
          })
        }
      })
    } else {
      interaction.editReply({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      getLeaderboard(client, message.guild, (members) => {
        if (members) {
          const embed = new MessageEmbed()
            .setTitle(`:trophy: ${i18n(locale, 'RANKING')} TOP 25`)
            .setFooter(message.guild.name)
            .setColor('#FFD700')

          let leaderboardStr = ''
          let count = 0
          members.forEach(function (row) {
            client.users.fetch(row.member).then((user) => {
              count++
              leaderboardStr = `${leaderboardStr}\n#${count}. **${user.username}#${user.discriminator}** (${i18n(locale, 'LEVEL')}: ${row.memberLevel}, ${i18n(locale, 'EXPERIENCE')} ${row.memberExperience}) `
              if (count === members.length) {
                message.reply({ embeds: [embed.setDescription(leaderboardStr)] })
              }
            })
          })
        }
      })
    } else {
      message.channel.send({ embeds: [Error(locale, 'COMMAND::NOAVALIABLE')] })
    }
  }
}
