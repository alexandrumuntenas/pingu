module.exports = {
    name: 'bienvenidas',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'canal':
                        if (message.mentions.channels.first()) {
                            var channel = message.mentions.channels.first();
                            var sql = "UPDATE `servidores` SET `bienvenida_canal_id` = '" + channel.id + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el canal de bienvenida. Anunciaré allí los nuevos miembros :thumbsup:');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Actualmente, el canal donde se notifican las bienvenidas es <#' + result[0].bienvenida_canal_id + '>. Para cambiar el canal, utilice el siguiente comando `' + global.prefix + 'bienvenidas canal <canal>`');
                        }
                        break;
                    case 'mensaje':
                        if (args[2]) {
                            var mensaje = message.content.replace(global.prefix + 'bienvenidas mensaje ', '');
                            var mensaje = emojiStrip(mensaje);
                            var sql = "UPDATE `servidores` SET `bienvenida_mensaje` = '" + mensaje + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el mensaje de bienvenida correctamente.');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Actualmente, el mensaje de bienvenida es `' + result[0].bienvenida_mensaje + '`. Para cambiar el mensaje, utilice el siguiente comando `' + global.prefix + 'bienvenidas mensaje <message>"`');
                        }
                        break;
                    case 'cartel':
                        var valor = result[0].bienvenida_cartel;
                        if (valor == 1) {
                            var fin = 0;
                            var response = 'desactivado';
                        } else {
                            var fin = 1;
                            var response = 'activado';
                        }
                        var sql = "UPDATE `servidores` SET `bienvenida_cartel` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                        message.channel.send(':white_check_mark: He ' + response + ' correctamente el cartel de bienvenida.');
                        con.query(sql);
                        break;
                    case 'enviar-mensaje':
                        var valor = result[0].bienvenida_mensaje_activado;
                        if (valor == 1) {
                            var fin = 0;
                            var response = 'desactivado';
                        } else {
                            var fin = 1;
                            var response = 'activado';
                        }
                        var sql = "UPDATE `servidores` SET `bienvenida_mensaje_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                        message.channel.send(':white_check_mark: Se ha ' + response + ' correctamente el mensaje de bienvenida.');
                        con.query(sql);
                        if (fin == 1) {
                            if (!result[0].bienvenida_mensaje) {
                                message.channel.send(':information_source: Configurar Mensaje de Bienvenida')
                                message.channel.send('[1/2] Introduzca el mensaje de bienvenida')
                                message.channel.awaitMessages(m => m.author.id == message.author.id,
                                    { max: 1 }).then(collected => {
                                        var mensaje = collected.first().content;
                                        var sql = "UPDATE `servidores` SET `bienvenida_mensaje` = '" + mensaje + "' WHERE `servidores`.`guild` = " + global.id;
                                        con.query(sql);
                                        message.channel.send('[2/2] Introduce la ID del canal en el que desea que se envíen las bienvenidas')
                                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                                            { max: 1 }).then(response2 => {
                                                const ID = client.channels.cache.get(response2.first().content);
                                                const channel = response2.first().mentions.channels.first() || ID;
                                                var sql2 = "UPDATE `servidores` SET `bienvenida_canal_id` = '" + channel.id + "' WHERE `servidores`.`guild` = " + global.id;
                                                con.query(sql2)
                                                message.reply(':white_check_mark: Se ha configurado correctamente el mensaje de bienvenida.');
                                            });
                                    });
                            }
                        }
                        break;
                    case 'dar-rol':
                        var final = [];
                        var roles = message.mentions.roles.array();
                        roles.forEach(i => {
                            var integer = i.id;
                            final.push('"' + integer + '"');
                        })
                        final = "[" + final.toString() + "]";
                        var sql = "UPDATE `servidores` SET `bienvenida_roles_user` = '" + final + "' WHERE `servidores`.`guild` = " + global.id;
                        con.query(sql);
                        message.channel.send(':white_check_mark: Se han actualizado los roles a otorgar correctamente.');
                        break;
                    default:
                        message.channel.send(':information_source: No has especificado una configuración válida del módulo de bienvenidas :arrow_right:  https://pingu.duoestudios.es/gestion-del-servidor/bienvenidas');
                        break;
                }
            } else {
                var valor = result[0].bienvenida_activado;
                if (valor == 1) {
                    var fin = 0;
                    var response = 'desactivadas';
                } else {
                    var fin = 1;
                    var response = 'activadas';
                }
                var sql = "UPDATE `servidores` SET `bienvenida_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                message.channel.send(':white_check_mark: Las bienvenidas han sido ' + response + '.');
                con.query(sql);
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}