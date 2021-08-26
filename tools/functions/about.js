const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'about',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.functions.about
    const embed = new MessageEmbed()
      .setColor('#FFFFFF')
      .addFields(
        {
          name: `:notebook_with_decorative_cover:  ${i18n.docs}`,
          value: 'https://rebrand.ly/pinguWiki',
          inline: true
        },
        {
          name: `<:reddit_upvote:876106253355585627> ${i18n.topgg}`,
          value: 'https://rebrand.ly/pinguWiki',
          inline: true
        },
        {
          name: `:tools: ${i18n.dbug}`,
          value: 'https://rebrand.ly/pinguWiki',
          inline: true
        },
        {
          name: `:satellite: ${i18n.guildcreate}`,
          value: 'https://rebrand.ly/pingu',
          inline: true
        },
        {
          name: `:speech_balloon: ${i18n.support}`,
          value: 'https://rebrand.ly/pinguSupport',
          inline: true
        },
        {
          name: `<:pingu_language:876103568006971433> ${i18n.languages}`,
          value: 'https://rebrand.ly/pinguRepository',
          inline: true
        }
      ).setFooter(`👪 ${client.guilds.cache.size} guilds`)
    message.channel.send(embed)
  }
}
