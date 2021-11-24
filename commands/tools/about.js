const { MessageEmbed } = require('discord.js')

module.exports = {
  cooldown: 0,
  name: 'about',
  description: '📖 About the bot',
  executeInteraction (client, locale, interaction) {
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
    interaction.editReply({ embeds: [embed] })
  },
  executeLegacy (client, locale, message) {
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
