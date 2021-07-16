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
                    message.channel.send('Para ejecutar una opción, indica el número de la opción. \n \n ****Opciones Disponibles** \n **1.** ¿Habilitar sistema de niveles? (Alterna entre sí y no) \n **2.** Establecer mensaje de avance de nivel \n **3.** Establecer canal de bienvenida \n **4.** ¿Enviar cartel de notificación de avance de nivel? \n **5.** Cambiar fondo de los carteles de ranking \n **6.** Cambia la dificultad de avanzar de nivel \n **7.** Dar X rol/es a los usuarios cuando alcancen X nivel :construction:\n **8.** Salir');
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                            if (isInteger(collected.first().content)) {
                                switch (collected.first().content) {
                                    case '1':
                                        t_niveles();
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
                        }).catch(collected => {
                            message.channel.send(':information_source: Se ha cerrado la configuración del módulo de niveles');
                        });
                }
                function t_niveles() {
                    var valor = result[0].niveles_activado;
                    if (valor == 1) {
                        var fin = 0;
                        var response = 'desactivado';
                        result[0].niveles_activado = 0;
                    } else {
                        var fin = 1;
                        var response = 'activado';
                        result[0].niveles_activado = 1;
                    }
                    var sql = "UPDATE `servidores` SET `niveles_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                    message.channel.send(':white_check_mark: El sistema de niveles ha sido ' + response + ' correctamente');
                    con.query(sql);
                }

                message.channel.send('<:info:858737080950718484> Configuración del módulo de **NIVELES**');
                indice();
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando');
        }
    }
}