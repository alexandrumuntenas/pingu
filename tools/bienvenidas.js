const { isInteger } = require("mathjs");

module.exports = {
    name: 'bienvenidas',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
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
                message.channel.send('Para ejecutar una opción, indica el número de la opción. \n \n ****Opciones Disponibles** \n **1.** ¿Enviar mensaje cuando alguien se une al servidor? \n **2.** Establecer mensaje de bienvenida \n **3.** Establecer canal de bienvenida \n **4.** ¿Enviar cartel de bienvenida? \n **5.** Cambiar fondo del cartel de bienvenida \n **6.** Dar un rol a los nuevos usuarios \n **7.** Salir');
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
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

        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}