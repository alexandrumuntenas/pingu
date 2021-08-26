const moment = require('moment')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'server-info',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.misc.serverinfo
    const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString())
    const members = message.guild.members.cache
    const channels = message.guild.channels.cache
    const emojis = message.guild.emojis.cache
    const embed = new MessageEmbed()
      .setTitle(i18n.title)
      .setColor('#FFFFFF')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(i18n.main, [
                `:pencil2: ${i18n.guildName}: \`${message.guild.name}\``,
                `:calendar: ${i18n.guildCreationDate}: \`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]\``,
                `:crown: ${i18n.guildOwner}: \`${message.guild.owner.user.tag}\``,
                `:id: ${i18n.guildId}: \`${message.guild.id}\``,
                `<a:nitro_boost:868214436178046976> ${i18n.guildBoost}: \`${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : i18n.guildBoostNone} (${message.guild.premiumSubscriptionCount || '0'})\``
      ], false)
      .addField('Estadísticas', [
                `<:roles:868216667858174013> ${i18n.guildRoles}: \`${roles.length}\``,
                `<a:custom_emoji:868217323075559495> ${i18n.guildCustomEmojis}: \n${i18n.guildStaticCustomEmojis} = \`${emojis.filter(emoji => !emoji.animated).size}\` | ${i18n.guildAnimatedCustomEmojis} = \`${emojis.filter(emoji => emoji.animated).size}\``,
                `:speech_balloon: ${i18n.guildChannels}: ${i18n.guildTextChannel} = \`${channels.filter(channel => channel.type === 'text').size}\` | ${i18n.guildVoiceChannel} = \`${channels.filter(channel => channel.type === 'voice').size}\``
      ], true)
      .addField(i18n.guildActivity, [
                `<:discord_online:876102925129236481> ${i18n.online}: \`${members.filter(member => member.presence.status === 'online').size}\``,
                `<:discord_idle:876102826273673296> ${i18n.idle}: \`${members.filter(member => member.presence.status === 'idle').size}\``,
                `<:discord_dnd:876102877255454791> ${i18n.dnd}: \`${members.filter(member => member.presence.status === 'dnd').size}\``,
                `<:discord_offline:876102753821278238> ${i18n.offline}: \`${members.filter(member => member.presence.status === 'offline').size}\``
      ], true)
      .setTimestamp()
    message.channel.send(embed)
  }
}
