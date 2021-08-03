const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'about',
  execute(args, client, con, contenido, message, result) {
    var lan = require(`../../languages/${result[0].idioma}.json`);
    lan = lan.tools.functions.about;
    const embed = new MessageEmbed()
      .setColor('#FFFFFF')
      .addFields(
        {
          name: `<:Document_Folder:867318660679073812> ${lan.docs}`,
          value: `https://bit.ly/pingu_docs`,
          inline: true
        },
        {
          name: `<:upvote:867318329651888128> ${lan.topgg}`,
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
          name: `<:language:868233627136315462> ${lan.languages}`,
          value: 'https://bit.ly/pingu_languages',
          inline: true
        }
      ).setFooter(`👪 ${client.guilds.cache.size} guilds`);
    message.channel.send(embed)
  }
}
