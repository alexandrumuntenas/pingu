const { MessageEmbed } = require('discord.js')
const { getLeaderboard } = require('../../modules/leveling')
const { loader } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'leaderboard',
  module: 'leveling',
  description: '🏆 Get the guild leveling leaderboard',
  runInteraction (locale, interaction) {
    getLeaderboard(interaction.guild, leaderboard => {
      const leaderboardEmbed = new MessageEmbed()
        .setColor('#FEE75C')
        .setTitle(`:trophy: ${i18n(locale, 'RANKING')} TOP 25`)
        .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
        .setTimestamp()

      let leaderboardStr = ''
      let count = 0

      leaderboard.forEach(registro => {
        count++
        leaderboardStr = `${leaderboardStr}\n${count}. **${registro.user.username || 'Mysterious User'}#${registro.user.discriminator || '0000'}** (${i18n(locale, 'LEVEL')}: ${registro.lvlLevel}, ${i18n(locale, 'EXPERIENCE')} ${registro.lvlExperience}) `

        if (count === leaderboard.length) {
          interaction.editReply({
            embeds: [leaderboardEmbed.setDescription(leaderboardStr)]
          })
        }
      })
    })
  },
  runCommand (locale, message) {
    message.reply({ embeds: [plantillas.precargador(i18n(locale, 'OBTAININGDATA'))] }).then(_message => {
      getLeaderboard(message.guild, leaderboard => {
        const leaderboardEmbed = new MessageEmbed()
          .setColor('#FEE75C')
          .setTitle(`:trophy: ${i18n(locale, 'RANKING')} TOP 25`)
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        _message.edit({ embeds: [plantillas.precargador(i18n(locale, 'PROCESSINGDATA'))] })

        let leaderboardStr = ''
        let count = 0

        leaderboard.forEach(registro => {
          count++
          leaderboardStr = `${leaderboardStr}\n${count}. **${registro.user.username || 'Mysterious User'}#${registro.user.discriminator || '0000'}** (${i18n(locale, 'LEVEL')}: ${registro.lvlLevel}, ${i18n(locale, 'EXPERIENCE')} ${registro.lvlExperience}) `

          if (count === leaderboard.length) {
            _message.edit({
              embeds: [leaderboardEmbed.setDescription(leaderboardStr)]
            })
          }
        })
      })
    })
  }
}
