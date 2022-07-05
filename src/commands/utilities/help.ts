const { EmbedBuilder } = require('discord.js')
const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'help',
  description: 'Feeling lost? 👀',
  cooldown: 1,
  runInteraction (interaction) {
    const helpMessage = new EmbedBuilder()
      .setColor('#2F3136')
      .setThumbnail(Client.user.displayAvatarURL())
      .setTitle(Client.user.username)
      .setDescription(`${i18n.obtenerTraduccion(interaction.guild.preferredLocale, 'HELP::HELPINGGUILDS', { GUILDS: Math.floor(Client.guilds.cache.size) })}`)
      .setFooter({ text: `©️ ${new Date().getFullYear()} Alexandru Muntenas`, iconURL: 'https://avatars.githubusercontent.com/u/59341776' })
      .addFields([
        { name: 'Vote us on', value: `[Top.GG](https://top.gg/bot/${Client.user.id}/vote)` },
        { name: 'Links', value: `[Docs](https://alexandrumuntenas.dev/pingu/ ) • [Help Translating](https://gitlocalize.com/repo/7231) • [Support Server](${process.env.GUILDSUPPORTINVITE || null}) • [Invite](https://discord.com/oauth2/authorize?client_id=${Client.user.id}&permissions=388627950679&scope=bot%20applications.commands) • [Source Code](https://github.com/alexandrumuntenas/pingu)` }
      ])

    interaction.editReply({ embeds: [helpMessage] })
  },
  runCommand (message) {
    const helpMessage = new EmbedBuilder()
      .setColor('#2F3136')
      .setThumbnail(Client.user.displayAvatarURL())
      .setTitle(Client.user.username)
      .setDescription(`${i18n.obtenerTraduccion(message.guild.preferredLocale, 'HELP::HELPINGGUILDS', { GUILDS: Math.floor(Client.guilds.cache.size) })}`)
      .setFooter({ text: `©️ ${new Date().getFullYear()} Alexandru Muntenas`, iconURL: 'https://avatars.githubusercontent.com/u/59341776' })
      .addFields([
        { name: 'Vote us on', value: `[Top.GG](https://top.gg/bot/${Client.user.id}/vote)` },
        { name: 'Links', value: `[Docs](https://alexandrumuntenas.dev/pingu/ ) • [Help Translating](https://gitlocalize.com/repo/7231) • [Support Server](${process.env.GUILDSUPPORTINVITE || null}) • [Invite](https://discord.com/oauth2/authorize?client_id=${Client.user.id}&permissions=388627950679&scope=bot%20applications.commands) • [Source Code](https://github.com/alexandrumuntenas/pingu)` }
      ])

    message.reply({ embeds: [helpMessage] })
  }
}