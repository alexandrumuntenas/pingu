const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'about',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.functions.about
    const embed = new MessageEmbed()
      .setColor('#FFFFFF')
      .addFields(
        {
          name: `:notebook_with_decorative_cover:  ${lan.docs}`,
          value: 'https://rebrand.ly/pinguWiki',
          inline: true
        },
        {
          name: `<:reddit_upvote:876106253355585627> ${lan.topgg}`,
          value: 'https://rebrand.ly/pinguWiki',
          inline: true
        },
        {
          name: `:tools: ${lan.dbug}`,
          value: 'https://rebrand.ly/pinguWiki',
          inline: true
        },
        {
          name: `:satellite: ${lan.guildcreate}`,
          value: 'https://rebrand.ly/pingu',
          inline: true
        },
        {
          name: `:speech_balloon: ${lan.support}`,
          value: 'https://rebrand.ly/pinguSupport',
          inline: true
        },
        {
          name: `<:pingu_language:876103568006971433> ${lan.languages}`,
          value: 'https://rebrand.ly/pinguRepository',
          inline: true
        }
      ).setFooter(`👪 ${client.guilds.cache.size} guilds`)
    message.channel.send(embed)
  }
}
