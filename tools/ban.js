module.exports = {
    name: 'ban',
    execute(client, versionbot, build, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    const user = message.mentions.users.first();
                    var motivo = message.content.replace(global.prefix + 'ban ', '');
                    var motivo = motivo.replace('<@!' + user.id + '>', '');
                    const member = message.guild.member(user);
                    if (member) {
                        member
                            .ban({
                                reason: motivo,
                            })
                            .then(() => {
                                message.channel.send(`:white_check_mark: Se ha baneado correctamente a ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`:x: No he podido banear a ${user.tag}`);
                            });
                    } else {
                        message.channel.send(":x: El usuario especificado no se encuentra en este servidor");
                    }
                } else {
                    message.channel.send(":information_source: No has mencionado a ningún usuario para banear. Uso del comando: `" + global.prefix + "ban <usuario>`");
                }
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}