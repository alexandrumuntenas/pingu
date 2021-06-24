module.exports = {
    name: 'despedidas',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, data) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'canal':
                        if (message.mentions.channels.first()) {
                            var channel = message.mentions.channels.first();
                            var sql = "UPDATE `servidores` SET `salida_canal` = '" + channel.id + "' WHERE `servidores`.`guild` = " + data.server.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el canal de despedidas. Anunciaré allí las salidas de miembros :thumbsup:');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + data.server.prefix + 'despedidas canal <canal>`');
                        }
                        break;
                    case 'mensaje':
                        if (args[2]) {
                            var mensaje = message.content.replace(data.server.prefix + 'despedidas mensaje ', '');
                            var mensaje = emojiStrip(mensaje);
                            var sql = "UPDATE `servidores` SET `salida_mensaje` = '" + mensaje + "' WHERE `servidores`.`guild` = " + data.server.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el mensaje correctamente.');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + data.server.prefix + 'despedidas mensaje <message>"`');
                        }
                        break;
                    default:
                        message.channel.send(':information_source: No has especificado una configuración válida del módulo de despedidas :arrow_right:  https://pingu.duoestudios.es/gestion-del-servidor/despedidas');
                        break;
                }
            } else {
                var valor = result[0].salida_activado;
                if (valor == 1) {
                    var fin = 0;
                    var response = 'desactivadas';
                } else {
                    var fin = 1;
                    var response = 'activadas';
                }
                var sql = "UPDATE `servidores` SET `salida_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + data.server.id;
                message.channel.send(':white_check_mark: Las despedidas han sido ' + response + '.');
                con.query(sql);
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}