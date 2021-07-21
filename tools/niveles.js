const emojiStrip = require('emoji-strip');
const { isInteger } = require('mathjs');

module.exports = {
    name: 'niveles',
    execute(args, client, con, contenido, global, message, result) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'fondo':
                        if (args[2] <= 20 && args[1] != 0) {
                            var sql = "UPDATE `servidores` SET `niveles_fondo` = '" + args[2] + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado el fondo del cartel de niveles');
                            con.query(sql);
                        } else {
                            message.channel.send(':x: Parece que el ID del fondo que has introducido es inválida. Consulta los fondos disponibles en https://pingu.duoestudios.es/personalizacion/fondos');
                        }
                        break;
                    case 'dificultad':
                        if (args[2]) {
                            var sql = "UPDATE `servidores` SET `niveles_dificultad` = '" + parseInt(args[2]) + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: Se ha actualizado la dificultad correctamente.');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'niveles dificultad <dificultad>`');
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
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'niveles canal <canal>`');
                        }
                        break;
                    case 'mensaje':
                        if (args[2]) {
                            var mensaje = message.content.replace(global.prefix + 'niveles mensaje ', '');
                            var mensaje = emojiStrip(mensaje);
                            var sql = "UPDATE `servidores` SET `niveles_canal_mensaje` = '" + mensaje + "' WHERE `servidores`.`guild` = " + global.id;
                            message.channel.send(':white_check_mark: El mensaje ha sido actualizado');
                            con.query(sql);
                        } else {
                            message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'niveles mensaje <mensaje>"`');
                        }
                        break;
                    default:
                        message.channel.send(':information_source: No has especificado una opción válida de configuración deseas modificar en el módulo de leveling :arrow_right: https://pingu.duoestudios.es/utilidades/mensajes-enriquecidos#comandos');
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
                    message.channel.send('Para ejecutar una opción, indica el número de la opción. \n \n ****Opciones Disponibles** \n **1.** ¿Habilitar sistema de niveles? \n **2.** Establecer mensaje de avance de nivel \n **3.** ¿Establecer canal de avance de nivel? \n **4.** ¿Enviar cartel de notificación de avance de nivel? \n **5.** Cambiar fondo de los carteles de ranking \n **6.** Cambia la dificultad de avanzar de nivel \n **7.** Dar X rol/es a los usuarios cuando alcancen X nivel :construction:\n **8.** Salir');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                            if (isInteger(collected.first().content)) {
                                switch (collected.first().content) {
                                    case '1':
                                        purga();
                                        t_niveles();
                                        break;
                                    case '2':
                                        purga();
                                        u_mensaje();
                                        break;
                                    case '3':
                                        purga();
                                        u_canal();
                                        break;
                                    case '4':
                                        purga();
                                        t_cartel();
                                        break;
                                    case '5':
                                        purga();
                                        u_fondo();
                                        break;
                                    case '6':
                                        purga();
                                        u_dificultad();
                                        break;
                                    case '7':
                                        purga();
                                        message.channel.send('Configuración en desarrollo...');
                                        indice();
                                        break;
                                    case '8':
                                        message.channel.send(':information_source: Se ha cerrado la configuración del módulo de **NIVELES**');
                                        break;
                                    default:
                                        purga();
                                        indice();
                                        break;
                                }
                            } else {
                                message.channel.send(':information_source: El valor especificado debe ser alfanumérico');
                                indice();
                            }
                        }).catch(error => {
                            message.channel.send(':information_source: Se ha cerrado la configuración del módulo de **NIVELES**');
                        });
                }

                function t_niveles() {
                    message.channel.send(':arrow_right: ¿Activar módulo de niveles? Respuestas disponibles: y(es) / n(o)');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (collected.first().content === "y" || collected.first().content === "yes") {
                                var yes = "UPDATE `servidores` SET `niveles_activado` = '1' WHERE `servidores`.`guild` = " + global.id;
                                con.query(yes);
                                message.channel.send(':white_check_mark: Se ha activado el módulo de niveles...');
                                indice();
                            } else {
                                var no = "UPDATE `servidores` SET `niveles_activado` = '0' WHERE `servidores`.`guild` = " + global.id;
                                con.query(no);
                                message.channel.send(':white_check_mark: Se ha desactivado el módulo de niveles...');
                                indice();
                            }
                        });
                }

                function t_cartel() {
                    message.channel.send(':arrow_right: ¿Enviar cartel de avance de nivel? Respuestas disponibles: y(es) / n(o)');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (collected.first().content === "y" || collected.first().content === "yes") {
                                var yes = "UPDATE `servidores` SET `niveles_cartel` = '1' WHERE `servidores`.`guild` = " + global.id;
                                con.query(yes);
                                message.channel.send(':white_check_mark: Se enviará el cartel de avance de nivel...');
                                indice();
                            } else {
                                var no = "UPDATE `servidores` SET `niveles_cartel` = '0' WHERE `servidores`.`guild` = " + global.id;
                                con.query(no);
                                message.channel.send(':white_check_mark: No se enviará el cartel de avance de nivel...');
                                indice();
                            }
                        });
                }

                function u_mensaje() {
                    message.channel.send(':arrow_right: ¿Qué mensaje desea que se envíe para notificar el avance de nivel? <:warn:858736919432527942> El mensaje de avance de nivel no soporta emojis. Si se incluyen, serán retirados automáticamente del texto.')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            var updatemsg = "UPDATE `servidores` SET `niveles_canal_mensaje` = '" + emojiStrip(collected.first().content) + "' WHERE `servidores`.`guild` = " + global.id;
                            con.query(updatemsg);
                            message.channel.send(':white_check_mark: Se ha actualizado el mensaje de avance de nivel');
                            indice();
                        });
                }

                function u_canal() {
                    message.channel.send(':arrow_right: ¿Dónde desea que se envíen los mensajes de avance de nivel? ¡Mencione el canal!')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (collected.first().mentions.channels.first()) {
                                var channel = collected.first().mentions.channels.first();
                                var updatechannel = "UPDATE `servidores` SET `niveles_canal_id` = '" + channel.id + "' WHERE `servidores`.`guild` = " + global.id;
                                con.query(updatechannel);
                                message.channel.send(':white_check_mark: Se ha actualizado el canal de avance de nivel');
                                indice();
                            } else {
                                message.channel.send(':x: No ha mencionado un canal válido')
                                u_canal();
                            }
                        });
                }

                function u_fondo() {
                    message.channel.send(':arrow_right: Introduzca el ID del fondo que desea establecer. Puede consultar los fondos disponibles en este enlace: https://pingu.duoestudios.es/personalizacion/fondos')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (isInteger(collected.first().content)) {
                                if (parseInt(collected.first().content) <= 20 && parseInt(collected.first().content) >= 1) {
                                    var updatemsg = "UPDATE `servidores` SET `niveles_fondo` = '" + collected.first().content + "' WHERE `servidores`.`guild` = " + global.id;
                                    con.query(updatemsg);
                                    message.channel.send(':white_check_mark: Se ha actualizado el fondo de los carteles de rank y avance de nivel');
                                    indice();
                                } else {
                                    message.channel.send(':x: Ese fondo no existe, por favor, introduzca un ID válido.')
                                    u_fondo();
                                }
                            } else {
                                message.channel.send(':x: El valor introducido debe ser alfanumérico.')
                                u_fondo();
                            }
                        });
                }

                function u_dificultad() {
                    message.channel.send(':arrow_right: Indique la dificultad de subir de nivel')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            if (isInteger(collected.first().content)) {
                                if (parseInt(collected.first().content) < 5 && parseInt(collected.first().content) > 0) {
                                    var updatemsg = "UPDATE `servidores` SET `niveles_dificultad` = '" + collected.first().content + "' WHERE `servidores`.`guild` = " + global.id;
                                    con.query(updatemsg);
                                    message.channel.send(':white_check_mark: Se ha actualizado la dificultad correctamente');
                                    indice();
                                } else {
                                    message.channel.send(':information_source: Debe introducir un valor entre 1-5. No se pueden emplear decimales...');
                                    u_dificultad();
                                }
                            } else {
                                message.channel.send(':x: El valor introducido debe ser alfanumérico.')
                                u_fondo();
                            }
                        });
                }

                message.channel.send('<:info:858737080950718484> Configuración del módulo de **NIVELES**');
                indice();
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando');
        }
    }
}