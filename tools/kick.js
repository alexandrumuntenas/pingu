module.exports = {
    name: 'kick',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var reason = message.content.replace(global.prefix + 'kick ', '');
                var array = message.mentions.users.array();
                var infraccion = message.content;
                array.forEach(user => {
                    reason = infraccion.replace('<@!' + user.id + '>', '');
                })
                message.mentions.users.array().forEach(user => {
                    const member = message.guild.member(user);
                    if (member) {
                        member
                            .kick({
                                reason: reason,
                            })
                            .then(() => {
                                message.channel.send(`:white_check_mark: Se ha expulsado correctamente a ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`:x: No se podido expulsar a ${user.tag}`);
                            });
                    }
                });
            } else {
                message.channel.send(':information_source: Mencione al menos un usuario para poder ejecutar este comando');
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}