const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'embed',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            // Menú
            var embed = new MessageEmbed();
            embed.setAuthor(message.author.username, message.author.avatarURL());
            embed.setTimestamp();
            embed.setFooter('Powered by Pingu')
            embed.setColor("#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }));
            addfields = 0;
            ftime = 0;
            function purga() {
                if (ftime == 0) {
                    message.channel.bulkDelete(2);
                    ++ftime;
                } else {
                    message.channel.bulkDelete(4);
                }
            }
            function indice() {
                message.channel.send('Para ejecutar una opción, indique el número de la opción. \n \n ****Opciones Disponibles** \n **1.** Establecer Título \n **2.** Establecer Descripción \n **3.** Establecer Thumbnail \n **4.** Añadir Nuevo Campo (hasta 25) \n **5.** Establecer Imagen \n **6.** Establecer color del borde \n **7.** Previsualizar mensaje \n **8.** Enviar mensaje \n **9.** Descartar mensaje');
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        switch (collected.first().content) {
                            case '1':
                                purga()
                                e_titulo();
                                break;
                            case '2':
                                purga()
                                e_descrip();
                                break;
                            case '3':
                                purga()
                                e_thumbnail();
                                break;
                            case '4':
                                purga()
                                a_field();
                                break;
                            case '5':
                                purga()
                                e_imagen();
                                break;
                            case '6':
                                purga()
                                e_color();
                                break;
                            case '7':
                                purga()
                                previsualizar();
                                break;
                            case '8':
                                purga()
                                enviar();
                                break;
                            case '9':
                                message.channel.send(':information_source: Se ha descartado el mensaje enriquecido.')
                                break;
                            default:
                                purga()
                                indice();
                                break;
                        }
                    });
            }

            function e_titulo() {
                message.channel.send(':arrow_right: Introduzca el título del mensaje enriquecido')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setTitle(collected.first());
                        indice();
                    });
            }

            function e_descrip() {
                message.channel.send(':arrow_right: Introduzca la descripción del mensaje enriquecido')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setDescription(collected.first());
                        indice();
                    });
            }

            function a_field() {
                ++addfields;
                if (addfields == 0 || addfields <= 25) {
                    message.channel.send(':arrow_right: Introduzca el título del nuevo campo #' + addfields);
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            var titulo = collected.first().content;
                            message.channel.send(':arrow_right: Introduzca la descripción del nuevo campo #' + addfields);
                            message.channel.awaitMessages(m => m.author.id == message.author.id,
                                { max: 1 }).then(collected => {
                                    var descrip = collected.first().content;
                                    message.channel.send(':arrow_right: Mostrar campo #' + addfields + ' en línea. Respuestas disponibles: y(es) / n(o)');
                                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                                        { max: 1 }).then(collected => {
                                            if (collected.first().content === "y" || collected.first().content === "yes") {
                                                embed.addField(titulo, descrip, true);
                                                indice();
                                            } else {
                                                embed.addField(titulo, descrip);
                                                indice();
                                            }
                                        });
                                });
                        });
                } else {
                    message.channel.send('<:prohibited:858736864176242718> No se pueden agregar más campos. El máximo son 25.')
                    indice();
                }
            }

            function e_imagen() {
                message.channel.send(':arrow_right: Introduzca la URL de la imagen.')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setImage(collected.first().content);
                        indice();
                    });
            }

            function e_thumbnail() {
                message.channel.send(':arrow_right: Introduzca la URL del Thumbnail.')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setThumbnail(collected.first().content);
                        indice();
                    });
            }

            function e_color() {
                message.channel.send(':arrow_right: Introduzca el color que deseas en hexadecimal. (Es necesario poner # al principio)')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setColor(collected.first().content);
                        indice();
                    });
            }

            function previsualizar() {
                message.channel.send('<:info:858737080950718484> Así lucirá su mensaje enriquecido.')
                message.channel.send(embed);
                indice();
            }

            function enviar() {
                message.channel.send(':arrow_right: ¿A dónde desea enviarlo? ¡Mencione el canal!')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        var canal = collected.first().mentions.channels.first();
                        const mensaje = client.channels.cache.find(channel => channel.id === canal.id);
                        mensaje.send(embed);
                        message.channel.send(':white_check_mark: Se ha enviado correctamente el mensaje enriquecido a <#' + canal.id + '>. Así luce:');
                        message.channel.send(embed);
                    });
            }
            message.channel.send('<:info:858737080950718484> Bienvenido al constructor visual de mensajes enriquecidos. Le iremos haciendo una serie de preguntas para ir construyendo su mensaje enriquecido a medida.');
            indice();
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}