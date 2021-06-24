module.exports = {
    name: 'user-info',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                const user = message.mentions.users.first() || message.member.user
                const member = message.guild.members.cache.get(user.id)
                const embed = new MessageEmbed()
                    .setAuthor(`Información de usuario de ${user.username}`, user.displayAvatarURL())
                    .addFields(
                        {
                            name: 'User tag',
                            value: user.tag,
                        },
                        {
                            name: 'Id del usuario',
                            value: user.id,
                        },
                        {
                            name: '¿Es un bot?',
                            value: user.bot,
                        },
                        {
                            name: 'Nickname',
                            value: member.nickname || 'No tiene',
                        },
                        {
                            name: 'Se unió al servidor el',
                            value: new Date(member.joinedTimestamp).toLocaleDateString(),
                        },
                        {
                            name: 'Se unió a Discord el',
                            value: new Date(user.createdTimestamp).toLocaleDateString(),
                        },
                        {
                            name: 'Cantidad de roles que tiene',
                            value: member.roles.cache.size - 1,
                        }
                    )

                message.channel.send(embed);
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}