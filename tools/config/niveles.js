const emojiStrip = require('emoji-strip');
const { isInteger } = require('mathjs');

module.exports = {
    name: 'niveles',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.niveles;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            ftime = 0;
            function purga() {
                if (ftime == 0) {
                    ++ftime;
                } else {
                    message.channel.bulkDelete(2);
                }
            }
            function indice() {
                message.channel.send(`${lan.index.before} \n \n **${lan.index.avaliable}** \n **1.** ${lan.index.options.first} \n **2.** ${lan.index.options.second} \n **3.** ${lan.index.options.third} \n **4.** ${lan.index.options.fourth} \n **5.** ${lan.index.options.fifth} \n **6.** ${lan.index.options.sixth} \n **7.** ${lan.index.options.seventh}`);
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
                                    u_fondo();
                                    break;
                                case '5':
                                    purga();
                                    u_dificultad();
                                    break;
                                case '6':
                                    purga();
                                    message.channel.send('Configuración en desarrollo...');
                                    indice();
                                    break;
                                case '7':
                                    message.channel.send(`:information_source: ${lan.time_error}`);
                                    break;
                                default:
                                    purga();
                                    indice();
                                    break;
                            }
                        } else {
                            message.channel.send(`:information_source: ${lan.isinteger}`);
                            indice();
                        }
                    }).catch(error => {
                        message.channel.send(`:information_source: ${lan.time_error}`);
                    });
            }

            function t_niveles() {
                message.channel.send(':arrow_right: ¿Activar módulo de niveles? Respuestas disponibles: y(es) / n(o)');
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().content === "y" || collected.first().content === "yes") {
                            var yes = "UPDATE `servidores` SET `niveles_activado` = '1' WHERE `servidores`.`guild` = " + message.guild.id;
                            con.query(yes);
                            message.channel.send(':white_check_mark: Se ha activado el módulo de niveles...');
                            indice();
                        } else {
                            var no = "UPDATE `servidores` SET `niveles_activado` = '0' WHERE `servidores`.`guild` = " + message.guild.id;
                            con.query(no);
                            message.channel.send(':white_check_mark: Se ha desactivado el módulo de niveles...');
                            indice();
                        }
                    });
            }

            function u_mensaje() {
                message.channel.send(':arrow_right: ¿Qué mensaje desea que se envíe para notificar el avance de nivel? <:warn:858736919432527942> El mensaje de avance de nivel no soporta emojis. Si se incluyen, serán retirados automáticamente del texto.')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        var updatemsg = "UPDATE `servidores` SET `niveles_canal_mensaje` = '" + emojiStrip(collected.first().content) + "' WHERE `servidores`.`guild` = " + message.guild.id;
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
                            var updatechannel = "UPDATE `servidores` SET `niveles_canal_id` = '" + channel.id + "' WHERE `servidores`.`guild` = " + message.guild.id;
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
                                var updatemsg = "UPDATE `servidores` SET `niveles_fondo` = '" + collected.first().content + "' WHERE `servidores`.`guild` = " + message.guild.id;
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
                                var updatemsg = "UPDATE `servidores` SET `niveles_dificultad` = '" + collected.first().content + "' WHERE `servidores`.`guild` = " + message.guild.id;
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
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando');
        }
    }
}