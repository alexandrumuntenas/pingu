const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'help',
  description: 'Feeling lost? This command will help you out!',
  permissions: [],
  runInteraction(client, locale, interaction) {
    const helpMessage = new MessageEmbed()
      .setColor('#2F3136')
      .addField('Help Us Grow', '[Vote and leave a rating in Top.GG](https://top.gg/bot/827199539185975417/)')
      .addField('Links', '[Docs](https://alexandrumuntenas.github.io/pingu/ ) • [Support Server](https://discord.com/invite/q55kCfekyy) • [Invite](https://discord.com/oauth2/authorize?client_id=827199539185975417&permissions=1933044831&scope=bot%20applications.commands) • [Source Code](https://github.com/alexandrumuntenas/pingu)')
      .setFooter({ text: `Helping ${client.guilds.cache.size} guilds`, iconURL: client.user.displayAvatarURL() })
    interaction.editReply({ embeds: [helpMessage] })
  },
  runCommand(client, locale, message) {
    const helpMessage = new MessageEmbed()
      .setColor('#2F3136')
      .addField('Help Us Grow', '[Vote and leave a rating in Top.GG](https://top.gg/bot/827199539185975417/)')
      .addField('Links', '[Docs](https://alexandrumuntenas.github.io/pingu/) • [Support Server](https://discord.com/invite/q55kCfekyy) • [Invite](https://discord.com/oauth2/authorize?client_id=827199539185975417&permissions=1933044831&scope=bot%20applications.commands) • [Source Code](https://github.com/alexandrumuntenas/pingu)')
      .setFooter({ text: `Helping ${client.guilds.cache.size} guilds`, iconURL: client.user.displayAvatarURL() })
    message.reply({ embeds: [helpMessage] })
  }
}