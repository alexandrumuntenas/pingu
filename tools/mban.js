module.exports = {
    name: 'mban',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                message.mentions.users.array().forEach(user => {
                    const member = message.guild.member(user);
                    if (member) {
                        member
                            .ban({
                                reason: 'undefined',
                            })
                            .then(() => {
                                message.channel.send(`:white_check_mark: Se ha baneado correctamente a ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`:x: No he podido banear a ${user.tag}`);
                            });
                    }
                });
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}