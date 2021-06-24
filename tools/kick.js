module.exports = {
    name: 'kick',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, data) {
        if (result[0].moderador_activado != 0) {
            if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
                if (message.mentions.users.first()) {
                    const user = message.mentions.users.first();
                    var motivo = message.content.replace(data.server.prefix + 'kick  ', '');
                    var motivo = motivo.replace('<@!' + user.id + '>', '');
                    const member = message.guild.member(user);
                    if (member) {
                        member
                            .kick(motivo)
                            .then(() => {
                                message.channel.send(`:white_check_mark: Se ha expulsado correctamente a ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`:x: No he podido expulsar a ${user.tag}`);
                            });
                    } else {
                        // The mentioned user isn't in this guild
                        message.channel.send(":x: El usuario mencionado no se encuentra en este servidor");
                    }
                    // Otherwise, if no user was mentioned
                } else {
                    message.channel.send(":information_source: No has mencionado a ningún usuario para expulsar. Uso del comando: `" + data.server.prefix + "expulsar <usuario>`");
                }
            } else {
                message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
            }
        }
    }
}