const { isInteger } = require("mathjs");

module.exports = {
    name: 'bienvenidas',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
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
                    case 'fondo':
                        if (args[2] <= 20 && args[1] != 0) {
                            var sql = "UPDATE `servidores` SET `bienvenida_fondo` = '" + args[2] + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el fondo del cartel de bienvenida');
                            con.query(sql);
                        } else {
                            message.channel.send(':x: Parece que el ID del fondo que has introducido es inválida. Consulta los fondos disponibles en https://pingu.duoestudios.es/personalizacion/fondos');
                        }
                        break;
                    default:
                        message.channel.send(':information_source: No has especificado una configuración válida del módulo de bienvenidas :arrow_right:  https://pingu.duoestudios.es/gestion-del-servidor/bienvenidas');
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
                    message.channel.send('Para ejecutar una opción, indica el número de la opción. \n \n ****Opciones Disponibles** \n **1.** ¿Enviar mensaje cuando alguien se une al servidor? \n **2.** Establecer mensaje de bienvenida \n **3.** Establecer canal de bienvenida \n **4.** ¿Enviar cartel de bienvenida? \n **5.** Cambiar fondo del cartel de bienvenida \n **6.** Dar un rol a los nuevos usuarios \n **7.** Salir');
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
                                    purga()
                                    t_cartel();
                                    break;
                                case '5':
                                    purga()
                                    u_fondo();
                                    break;
                                case '6':
                                    purga()
                                    dar_rol();
                                    break;
                                case '7':
                                    message.channel.send(':information_source: Se ha cerrado la configuración del módulo de bienvenidas')
                                    break;
                                default:
                                    purga();
                                    indice();
                                    break;
                            }
                        }).catch(collected => {
                            message.channel.send(':information_source: Se ha cerrado la configuración del módulo de bienvenidas');
                        });
                }

                function t_mensaje() {
                    message.channel.send(':arrow_right: ¿Enviar mensaje de bienvenida cuando se una un nuevo miembro? Respuestas disponibles: y(es) / n(o)');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (collected.first().content === "y" || collected.first().content === "yes") {
                                var yes = "UPDATE `servidores` SET `bienvenida_mensaje_activado` = '1' WHERE `servidores`.`guild` = " + global.id;
                                con.query(yes);
                                message.channel.send(':white_check_mark: ¡Genial! A partir de ahora, enviaré mensajes de bienvenida a los recién llegados...');
                                indice();
                            } else {
                                var no = "UPDATE `servidores` SET `bienvenida_mensaje_activado` = '0' WHERE `servidores`.`guild` = " + global.id;
                                con.query(no);
                                message.channel.send(':white_check_mark: No se enviarán mensajes de bienvenida...');
                                indice();
                            }
                        });
                }

                function t_cartel() {
                    message.channel.send(':arrow_right: ¿Enviar cartel de bienvenida cuando se una un nuevo miembro? Respuestas disponibles: y(es) / n(o)');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (collected.first().content === "y" || collected.first().content === "yes") {
                                var yes = "UPDATE `servidores` SET `bienvenida_cartel` = '1' WHERE `servidores`.`guild` = " + global.id;
                                con.query(yes);
                                message.channel.send(':white_check_mark: ¡Genial! A partir de ahora, enviaré también los carteles de bienvenida a los recién llegados...');
                                indice();
                            } else {
                                var no = "UPDATE `servidores` SET `bienvenida_cartel` = '0' WHERE `servidores`.`guild` = " + global.id;
                                con.query(no);
                                message.channel.send(':white_check_mark: No se enviarán carteles de bienvenida...');
                                indice();
                            }
                        });
                }

                function dar_rol() {
                    message.channel.send(':information_source: Esta opción no está disponible actualmente.');
                    indice();
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

                function u_fondo() {
                    message.channel.send(':arrow_right: Introduce el ID del fondo que deseas establecer. Puedes consultar los fondos disponibles en este enlace: https://pingu.duoestudios.es/personalizacion/fondos')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (isInteger(collected.first().content)) {
                                if (parseInt(collected.first().content) <= 20 || parseInt(collected.first().content) >= 1) {
                                    var updatemsg = "UPDATE `servidores` SET `bienvenida_fondo` = '" + collected.first().content + "' WHERE `servidores`.`guild` = " + global.id;
                                    con.query(updatemsg);
                                    message.channel.send(':white_check_mark: Se ha actualizado el mensaje de bienvenida correctamente.');
                                    indice();
                                } else {
                                    message.channel.send(':x: Ese fondo no existe, por favor, introduce un ID válido.')
                                    u_fondo();
                                }
                            } else {
                                message.channel.send(':x: El valor introducido debe ser alfanumérico.')
                                u_fondo();
                            }
                        });
                }

                message.channel.send('<:info:858737080950718484> Configuración del módulo de **BIENVENIDAS**');
                indice();
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}