const moment = require('moment');
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'server-info',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.misc.serverinfo;
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = message.guild.members.cache;
        const channels = message.guild.channels.cache;
        const emojis = message.guild.emojis.cache;
        const embed = new MessageEmbed()
            .setTitle(lan.title)
            .setColor('#FFFFFF')
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .addField(lan.main, [
                `:pencil2: ${lan.guildName}: \`${message.guild.name}\``,
                `:calendar: ${lan.guildCreationDate}: \`${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]\``,
                `:crown: ${lan.guildOwner}: \`${message.guild.owner.user.tag}\``,
                `:id: ${lan.guildId}: \`${message.guild.id}\``,
                `<a:nitro_boost:868214436178046976> ${lan.guildBoost}: \`${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'} (${message.guild.premiumSubscriptionCount || '0'})\``,
            ], false)
            .addField('Estadísticas', [
                `<:roles:868216667858174013> ${lan.guildRoles}: \`${roles.length}\``,
                `<a:custom_emoji:868217323075559495> ${lan.guildCustomEmojis}: \n${lan.guildStaticCustomEmojis} = \`${emojis.filter(emoji => !emoji.animated).size}\` | ${lan.guildAnimatedCustomEmojis} = \`${emojis.filter(emoji => emoji.animated).size}\``,
                `:speech_balloon: ${lan.guildChannels}: ${lan.guildTextChannel} = \`${channels.filter(channel => channel.type === 'text').size}\` | ${lan.guildVoiceChannel} = \`${channels.filter(channel => channel.type === 'voice').size}\``,
            ], true)
            .addField(lan.guildActivity, [
                `<:discord_online:876102925129236481> ${lan.online}: \`${members.filter(member => member.presence.status === 'online').size}\``,
                `<:discord_idle:876102826273673296> ${lan.idle}: \`${members.filter(member => member.presence.status === 'idle').size}\``,
                `<:discord_dnd:876102877255454791> ${lan.dnd}: \`${members.filter(member => member.presence.status === 'dnd').size}\``,
                `<:discord_offline:876102753821278238> ${lan.offline}: \`${members.filter(member => member.presence.status === 'offline').size}\``,
            ], true)
            .setTimestamp();
        message.channel.send(embed);
    }
}