const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'user-info',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.userinfo;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                const user = message.mentions.users.first() || message.member.user
                const member = message.guild.members.cache.get(user.id)
                const embed = new MessageEmbed()
                    .setThumbnail(user.displayAvatarURL())
                    .addFields(
                        {
                            name: lan.usertag,
                            value: user.tag,
                            inline: true
                        },
                        {
                            name: lan.userid,
                            value: user.id,
                            inline: true
                        },
                        {
                            name: lan.isabot,
                            value: user.bot,
                            inline: true
                        },
                        {
                            name: lan.hasnick,
                            value: member.nickname || 'No tiene',
                            inline: true
                        },
                        {
                            name: lan.joinedguild,
                            value: new Date(member.joinedTimestamp).toLocaleDateString(),
                            inline: true
                        },
                        {
                            name: lan.joineddiscord,
                            value: new Date(user.createdTimestamp).toLocaleDateString(),
                            inline: true
                        },
                    )

                message.channel.send(embed);
            }
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}