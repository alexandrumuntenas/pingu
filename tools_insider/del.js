module.exports = {
    name: 'del',
    execute(client, versionbot, build, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (args[1]) {
                    var i = parseInt(args[1]);
                    if (i < 999 && i > 0) {
                        message.channel.bulkDelete(i + 1, true)
                            .then((_message) => {
                                message.channel
                                    .send(`He eliminado \`${_message.size - 1}\` mensajes :broom:`);
                            });

                    } else {
                        message.channel.send(':information_source: Introduce un valor entre 1-99. Por ejemplo: ' + global.prefix + 'del 65');
                    }
                } else {
                    message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'del <cantidad>`');
                }
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}