module.exports = {
    name: 'warn',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, data) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    var user = message.mentions.users.first();
                    var cache = { "activado": result[0].moderador_warn_expulsion_activado, "cantidad": result[0].moderador_warn_expulsion_cantidad, "accion": result[0].moderador_warn_expulsion_accion };
                    if (args[2]) {
                        if (cache.activado != 0) {
                            var consultarcantidad = "SELECT COUNT(*) AS itotal FROM `infracciones` WHERE user = '" + user.id + "' AND guild = '" + data.server.id + "'";
                            con.query(consultarcantidad, function (err, result) {
                                var infraccion = message.content.replace(data.server.prefix + 'warn ', '');
                                var infraccion = infraccion.replace('<@!' + user.id + '>', '');
                                var nuevainfraccion = "INSERT INTO `infracciones` (`user`, `guild`,`motivo`) VALUES ('" + user.id + "', '" + data.server.id + "','" + infraccion + "')";
                                con.query(nuevainfraccion);
                                var embed = new MessageEmbed().setAuthor(user.tag + " usted ha sido advertido", user.displayAvatarURL()).setTitle('Detalles de infracción').setDescription(infraccion);
                                message.channel.send(embed);
                                const member = message.guild.member(user);
                                if (parseInt(result[0].itotal) + 1 >= cache.cantidad) {
                                    if (cache.accion != 0) {
                                        member
                                            .ban({
                                                reason: 'Acumulación de infracciones.',
                                            })
                                            .then(() => {
                                                message.channel.send(`:police_officer: El usuario ${user.tag} ha sido baneado del servidor por acumular más de ` + cache.cantidad + " infracciones.");
                                            })
                                            .catch(err => {
                                                message.channel.send(`:x: Se ha intentado banear el usuario ${user.tag} por acumular más de ` + cache.cantidad + " infracciones, pero se ha producido un error...");
                                            });
                                    } else {
                                        member
                                            .kick('Acumulación de infracciones.')
                                            .then(() => {
                                                message.channel.send(`:police_officer: El usuario ${user.tag} ha sido expulsado del servidor por acumular más de ` + cache.cantidad + " infracciones.");
                                            })
                                            .catch(err => {
                                                message.channel.send(`:x: Se ha intentado expulsar el usuario ${user.tag} por acumular más de ` + cache.cantidad + " infracciones, pero se ha producido un error...");
                                            });
                                    }
                                }
                            });
                        } else {
                            var infraccion = message.content.replace(data.server.prefix + 'warn ', '');
                            var infraccion = infraccion.replace('<@!' + user.id + '>', '');
                            var nuevainfraccion = "INSERT INTO `infracciones` (`user`, `guild`,`motivo`) VALUES ('" + user.id + "', '" + data.server.id + "','" + infraccion + "')";
                            con.query(nuevainfraccion);
                            var embed = new MessageEmbed().setAuthor(user.tag + " usted ha sido advertido", user.displayAvatarURL()).setTitle('Detalles de infracción').setDescription(infraccion);
                            message.channel.send(embed);
                        }
                    } else {
                        message.channel.send(':information_source: Te falta el motivo de la infracción. Uso: `' + data.server.prefix + 'warn <usuario> <motivo>`');
                    }
                } else {
                    message.channel.send(':information_source: No has mencionado a ningún usuario y no has introducido un motivo. Uso: `' + data.server.prefix + 'warn <usuario> <motivo>`');
                }
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}