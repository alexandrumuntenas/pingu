module.exports = {
    name: 'niveles',
    execute(args, client, con, contenido, downloader, emojiStrip, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, webp) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'aspecto':
                        if (args[2] <= 9 && args[1] != 0) {
                            var sql = "UPDATE `servidores` SET `niveles_aspecto` = '" + args[2] + "', `niveles_fondo_custom` = '" + args[3] + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(' se ha actualizado el aspecto del cartel de niveles');
                            con.query(sql);
                        } else {
                            message.channel.send(' parece que el ID del aspecto que has introducido es inválida. Consulta los aspectos disponibles en https://pingu.duoestudios.es/gestion-del-servidor/niveles#skins');
                        }
                        break;
                    case 'dificultad':
                        if (args[2]) {
                            var sql = "UPDATE `servidores` SET `niveles_dificultad` = '" + parseInt(args[2]) + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado la dificultad correctamente.');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.server.prefix + 'niveles dificultad <dificultad>`');
                        }
                        break;
                    case 'canal':
                        if (message.mentions.channels.first()) {
                            var canal = message.mentions.channels.first();
                            var canalid = canal.id;
                            var sql = "UPDATE `servidores` SET `niveles_canal_id` = '" + canalid + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el canal de niveles. Anunciaré allí los avances de nivel :thumbsup:');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.server.prefix + 'niveles canal <canal>`');
                        }
                        break;
                    case 'mensaje':
                        if (args[2]) {
                            var mensaje = message.content.replace(global.server.prefix + 'niveles mensaje ', '');
                            var mensaje = emojiStrip(mensaje);
                            var sql = "UPDATE `servidores` SET `niveles_canal_mensaje` = '" + mensaje + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: El mensaje ha sido actualizado');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.server.prefix + 'niveles mensaje <mensaje>"`');
                        }
                        break;
                    default:
                        message.channel.send(':information_source: No has especificado una opción válida de configuración deseas modificar en el módulo de leveling :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/niveles#comandos');
                        break;
                }
            } else {
                var valor = result[0].niveles_activado;
                if (valor == 1) {
                    var fin = 0;
                    var response = 'desactivado';
                } else {
                    var fin = 1;
                    var response = 'activado';
                }
                var sql = "UPDATE `servidores` SET `niveles_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                message.channel.send(':white_check_mark: Bip Bip... El módulo de niveles ha sido ' + response + '.');
                con.query(sql);
            }
        }
    }
}