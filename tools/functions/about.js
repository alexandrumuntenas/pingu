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
          value: 'https://bit.ly/pingu_docs',
          inline: true
        },
        {
          name: `<:reddit_upvote:876106253355585627> ${lan.topgg}`,
          value: 'https://bit.ly/pingu_topgg',
          inline: true
        },
        {
          name: `:tools: ${lan.dbug}`,
          value: 'https://bit.ly/pingu_dbug',
          inline: true
        },
        {
          name: `:satellite: ${lan.guildcreate}`,
          value: 'https://bit.ly/pingu_invite',
          inline: true
        },
        {
          name: `:speech_balloon: ${lan.support}`,
          value: 'https://bit.ly/pingu_support',
          inline: true
        },
        {
          name: `<:pingu_language:876103568006971433> ${lan.languages}`,
          value: 'https://bit.ly/pingu_languages',
          inline: true
        }
      ).setFooter(`👪 ${client.guilds.cache.size} guilds`)
    message.channel.send(embed)
  }
}
