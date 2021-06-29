module.exports = {
    name: 'warn',
    execute(args, canvacord, client, con, Sentry, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var array = message.mentions.users.array();
                message.mentions.users.array().forEach(user => {
                    var cache = { "activado": result[0].moderador_warn_expulsion_activado, "cantidad": result[0].moderador_warn_expulsion_cantidad, "accion": result[0].moderador_warn_expulsion_accion };
                    if (cache.activado != 0) {
                        var consultarcantidad = "SELECT COUNT(*) AS itotal FROM `infracciones` WHERE user = '" + user.id + "' AND guild = '" + global.id + "'";
                        con.query(consultarcantidad, function (err, result) {
                            var infraccion = message.content.replace(global.prefix + 'warn ', '');
                            array.forEach(user => {
                                infraccion = infraccion.replace('<@!' + user.id + '>', '');
                            })
                            var nuevainfraccion = "INSERT INTO `infracciones` (`user`, `guild`,`motivo`) VALUES ('" + user.id + "', '" + global.id + "','" + infraccion + "')";
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
                        var infraccion = message.content.replace(global.prefix + 'mwarn ', '');
                        array.forEach(user => {
                            infraccion = infraccion.replace('<@!' + user.id + '>', '');
                        })
                        var nuevainfraccion = "INSERT INTO `infracciones` (`user`, `guild`,`motivo`) VALUES ('" + user.id + "', '" + global.id + "','" + infraccion + "')";
                        con.query(nuevainfraccion);
                        var embed = new MessageEmbed().setAuthor(user.tag + " usted ha sido advertido", user.displayAvatarURL()).setTitle('Detalles de infracción').setDescription(infraccion);
                        message.channel.send(embed);
                    }
                });
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}