module.exports = {
    name: 'despedidas',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'canal':
                        if (message.mentions.channels.first()) {
                            var channel = message.mentions.channels.first();
                            var sql = "UPDATE `servidores` SET `salida_canal` = '" + channel.id + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el canal de despedidas. Anunciaré allí las salidas de miembros :thumbsup:');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'despedidas canal <canal>`');
                        }
                        break;
                    case 'mensaje':
                        if (args[2]) {
                            var mensaje = message.content.replace(global.prefix + 'despedidas mensaje ', '');
                            var mensaje = emojiStrip(mensaje);
                            var sql = "UPDATE `servidores` SET `salida_mensaje` = '" + mensaje + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el mensaje correctamente.');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'despedidas mensaje <message>"`');
                        }
                        break;
                    default:
                        message.channel.send(':information_source: No has especificado una configuración válida del módulo de despedidas :arrow_right:  https://pingu.duoestudios.es/gestion-del-servidor/despedidas');
                        break;
                }
            } else {
                ftime = 0;
                function purga() {
                    if (ftime == 0) {
                        ++ftime;
                    } else {
                        message.channel.bulkDelete(2);
                    }
                }

                function indice() {
                    message.channel.send('Para ejecutar una opción, indica el número de la opción. \n \n ****Opciones Disponibles** \n **1.** ¿Enviar mensaje cuando alguien abandona el servidor? \n **2.** Establecer mensaje de despedidas \n **3.** Establecer canal de despedida \n **4.** Salir');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                            switch (collected.first().content) {
                                case '1':
                                    purga()
                                    t_mensaje();
                                    break;
                                case '2':
                                    purga()
                                    u_mensaje();
                                    break;
                                case '3':
                                    purga()
                                    u_canal();
                                    break;
                                case '4':
                                    message.channel.send(':information_source: Se ha cerrado la configuración del módulo de despedidas')
                                    break;
                                default:
                                    purga();
                                    indice();
                                    break;
                            }
                        }).catch(collected => {
                            message.channel.send(':information_source: Se ha cerrado la configuración del módulo de despedidas');
                        });
                }

                function t_mensaje() {
                    message.channel.send(':arrow_right: ¿Enviar mensaje de bienvenida cuando se una un nuevo miembro? Respuestas disponibles: y(es) / n(o)');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (collected.first().content === "y" || collected.first().content === "yes") {
                                var yes = "UPDATE `servidores` SET `salida_mensaje_activado` = '1' WHERE `servidores`.`guild` = " + global.id;
                                con.query(yes);
                                message.channel.send(':white_check_mark: A partir de ahora se enviarán mensajes de despedidas...');
                                indice();
                            } else {
                                var no = "UPDATE `servidores` SET `salida_mensaje_activado` = '0' WHERE `servidores`.`guild` = " + global.id;
                                con.query(no);
                                message.channel.send(':white_check_mark: No se enviarán mensajes de despedida...');
                                indice();
                            }
                        });
                }

                function u_canal() {
                    message.channel.send(':arrow_right: ¿Dónde deseas que se envíen los mensajes y carteles de bienvenida? ¡Menciona el canal!')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (collected.first().mentions.channels.first()) {
                                var channel = collected.first().mentions.channels.first();
                                var updatechannel = "UPDATE `servidores` SET `bienvenida_canal_id` = '" + channel.id + "' WHERE `servidores`.`guild` = " + global.id;
                                con.query(updatechannel);
                                message.channel.send(':white_check_mark: Se ha actualizado el canal de bienvenida. Anunciaré allí los nuevos miembros :thumbsup:');
                                indice();
                            } else {
                                message.channel.send(':x: No has mencionado un canal válido.')
                                u_canal();
                            }
                        });
                }

                function u_mensaje() {
                    message.channel.send(':arrow_right: ¿Qué mensaje deseas que envíe para recibir a los nuevos miembros? <:warn:858736919432527942> El mensaje de bienvenida no soporta emojis. Si se incluyen, serán retirados automáticamente del texto.')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            var updatemsg = "UPDATE `servidores` SET `bienvenida_mensaje` = '" + emojiStrip(collected.first().content) + "' WHERE `servidores`.`guild` = " + global.id;
                            con.query(updatemsg);
                            message.channel.send(':white_check_mark: Se ha actualizado el mensaje de bienvenida correctamente.');
                            indice();
                        });
                }

                message.channel.send('<:info:858737080950718484> Configuración del módulo de **DESPEDIDAS / SALIDAS**');
                indice();
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}