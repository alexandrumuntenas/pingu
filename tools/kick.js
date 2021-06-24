module.exports = {
    name: 'kick',
    execute(args, client, con, contenido, downloader, emojiStrip, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var reason = message.content.replace(global.server.prefix + 'kick ', '');
                var array = message.mentions.users.array();
                array.forEach(user => {
                    reason = infraccion.replace('<@!' + user.id + '>', '');
                })
                message.mentions.users.array().forEach(user => {
                    const member = message.guild.member(user);
                    if (member) {
                        member
                            .ban({
                                reason: reason,
                            })
                            .then(() => {
                                message.channel.send(`:white_check_mark: Se ha expulsado correctamente a ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`:x: No he podido expulsar a ${user.tag}`);
                            });
                    }
                });
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}