module.exports = {
    name: 'embed',
    execute(args, client, con, Sentry, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            // Menú
            var embed = new MessageEmbed();
            embed.setAuthor(message.author.username, message.author.avatarURL());
            embed.setTimestamp();
            embed.setFooter('Powered by Pingu')
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
                message.channel.send('Para ejecutar una opción, indica el número de la opción. \n \n ****Opciones Disponibles** \n **1.** Establecer Título \n **2.** Establecer Descripción \n **3.** Establecer Thumbnail \n **4.** Añadir Nuevo Campo (hasta 25) \n **5.** Establecer Imagen \n **6.** Establecer color del borde \n **7.** Previsualizar mensaje \n **8.** Enviar mensaje');
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
                        }
                    });
            }

            function e_titulo() {
                message.channel.send(':arrow_right: Introduce el título del mensaje enriquecido')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setTitle(collected.first());
                        indice();
                    });
            }

            function e_descrip() {
                message.channel.send(':arrow_right: Introduce la descripción del mensaje enriquecido')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setDescription(collected.first());
                        indice();
                    });
            }

            function a_field() {
                ++addfields;
                if (addfields == 0 || addfields <= 25) {
                    message.channel.send(':arrow_right: Introduce el título del nuevo campo #' + addfields);
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            var titulo = collected.first().content;
                            message.channel.send(':arrow_right: Introduce la descripción del nuevo campo #' + addfields);
                            message.channel.awaitMessages(m => m.author.id == message.author.id,
                                { max: 1 }).then(collected => {
                                    var descrip = collected.first().content;
                                    message.channel.send(':arrow_right: Mostrar campo #' + addfields + ' en línea. Respuestas disponibles: y(es) / n(o)');
                                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                                        { max: 1 }).then(collected => {
                                            if (collected.first().content === "y") {
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
                message.channel.send(':arrow_right: Introduce la URL de la imagen.')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setImage(collected.first().content);
                        indice();
                    });
            }

            function e_thumbnail() {
                message.channel.send(':arrow_right: Introduce la URL del Thumbnail.')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setThumbnail(collected.first().content);
                        indice();
                    });
            }

            function e_color() {
                message.channel.send(':arrow_right: Introduce el color que deseas en hexadecimal.')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setColor(collected.first().content);
                        indice();
                    });
            }

            function previsualizar() {
                message.channel.send('<:info:858737080950718484> Así lucirá tu mensaje enriquecido.')
                message.channel.send(embed);
                indice();
            }

            function enviar() {
                message.channel.send(':arrow_right: Genial, solo nos falta una última cosa para enviar el mensaje enriquecido. ¿A dónde quieres enviarlo? ¡Menciona el canal!')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        var canal = collected.first().mentions.channels.first();
                        const mensaje = client.channels.cache.find(channel => channel.id === canal.id);
                        mensaje.send(embed);
                        message.channel.send(':white_check_mark: Se ha enviado correctamente el mensaje enriquecido a <#' + canal.id + '>. Así luce:');
                        message.channel.send(embed);
                    });
            }

            // Comienzo del constructor visual
            message.channel.send('<:info:858737080950718484> Bienvenido al constructor visual de mensajes enriquecidos. Le iremos haciendo una serie de preguntas para ir construyendo su mensaje enriquecido a medida.');
            indice(embed, 0);

        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}
//