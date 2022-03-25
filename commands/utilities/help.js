const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'help',
  description: 'Feeling lost? 👀',
  cooldown: 1,
  runInteraction (locale, interaction) {
    const helpMessage = new MessageEmbed()
      .setColor('#2F3136')
      .setThumbnail(process.Client.user.displayAvatarURL())
      .setTitle(process.Client.user.username)
      .setDescription(`${i18n(locale, 'HELP::HELPINGGUILDS', { GUILDS: Math.floor(process.Client.guilds.cache.size) })}`)
      .setFooter({ text: `©️ ${new Date().getFullYear()} Alexandru Muntenas`, iconURL: 'https://avatars.githubusercontent.com/u/59341776' })

    helpMessage.addField('Vote us on', `[Top.GG](https://top.gg/bot/${process.Client.user.id}/vote)`)
    helpMessage.addField('Links', `[Docs](https://alexandrumuntenas.dev/pingu/ ) • [Support Server](${process.env.GUILDSUPPORTINVITE || null}) • [Invite](https://discord.com/oauth2/authorize?client_id=${process.Client.user.id}&permissions=388627950679&scope=bot%20applications.commands) • [Source Code](https://github.com/alexandrumuntenas/pingu)`)

    interaction.editReply({ embeds: [helpMessage] })
  },
  runCommand (locale, message) {
    const helpMessage = new MessageEmbed()
      .setColor('#2F3136')
      .setThumbnail(process.Client.user.displayAvatarURL())
      .setTitle(process.Client.user.username)
      .setDescription(`${i18n(locale, 'HELP::HELPINGGUILDS', { GUILDS: Math.floor(process.Client.guilds.cache.size) })}`)
      .setFooter({ text: `©️ ${new Date().getFullYear()} Alexandru Muntenas`, iconURL: 'https://avatars.githubusercontent.com/u/59341776' })

    helpMessage.addField('Vote us on', `[Top.GG](https://top.gg/bot/${process.Client.user.id}/vote)`)
    helpMessage.addField('Links', `[Docs](https://alexandrumuntenas.dev/pingu/ ) • [Support Server](${process.env.GUILDSUPPORTINVITE || null}) • [Invite](https://discord.com/oauth2/authorize?client_id=${process.Client.user.id}&permissions=388627950679&scope=bot%20applications.commands) • [Source Code](https://github.com/alexandrumuntenas/pingu)`)

    message.reply({ embeds: [helpMessage] })
  }
}
