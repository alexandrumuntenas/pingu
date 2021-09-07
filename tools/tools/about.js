const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'about',
  execute (client, locale, message, result) {
    const embed = new MessageEmbed()
      .setColor('#FFFFFF')
      .addFields(
        {
          name: '<:reddit_upvote:876106253355585627> Vote us in TopGG',
          value: 'https://rebrand.ly/pinguTopGG'
        },
        {
          name: ':tools: Report issues',
          value: 'https://rebrand.ly/pinguIssues'
        },
        {
          name: ':satellite: Add Pingu to a new guild',
          value: 'https://rebrand.ly/pingu'
        },
        {
          name: ':speech_balloon: Pingu\'s support server',
          value: 'https://rebrand.ly/pinguSupport'
        }
      ).setFooter(`👪 ${client.guilds.cache.size} guilds`)
    message.channel.send({ embeds: [embed] })
  }
}
