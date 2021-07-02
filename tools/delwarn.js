module.exports = {
    name: 'delwarn',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    if (args[2]) {
                        var borrarwarn = "DELETE FROM infracciones WHERE guild = " + global.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        var existewarn = "SELECT * FROM infracciones WHERE guild = " + global.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        con.query(existewarn, function (err, result) {
                            if (result.hasOwnProperty(0)) {
                                con.query(borrarwarn);
                                message.channel.send(':white_check_mark: Se ha eliminado la advertencia (`' + args[2] + '`) del usuario `' + message.mentions.users.first().tag + '` correctamente.');
                            } else {
                                message.channel.send(':information_source: El usuario `' + message.mentions.users.first().tag + '` no dispone de la infracción `' + args[2] + '`.');
                            }
                        });
                    } else {
                        message.channel.send(':information_source: Debe indicar el identificador del warn. Uso: `' + global.prefix + 'delwarn <usuario> <id>`');
                    }
                } else {
                    message.channel.send(':information_source: No has mencionado a ningún usuario. Uso: `' + global.prefix + 'delwarn <usuario> <id>`');
                }
            } else {
                message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
            }
        }
    }
}