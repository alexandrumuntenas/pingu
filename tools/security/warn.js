const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'warn',
    execute(args, client, con, contenido, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                function makeId(length) {
                    var result = '';
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() *
                            charactersLength));
                    }
                    return result;
                }
                var warn = message.content;
                message.mentions.users.array().forEach(user => {
                    warn = warn.replace('<@!' + user.id + '>', '');
                    warn = warn.replace('<@' + user.id + '>', '');
                    warn = warn.replace(`${result[0].prefix}warn`, '');
                })
                message.mentions.users.array().forEach(user => {
                    var cache = { "activado": result[0].moderador_warn_expulsion_activado, "cantidad": result[0].moderador_warn_expulsion_cantidad, "accion": result[0].moderador_warn_expulsion_accion };
                    var consultarcantidad = "SELECT COUNT(*) AS itotal FROM `infracciones` WHERE user = '" + user.id + "' AND guild = '" + message.guild.id + "'";
                    con.query(consultarcantidad, function (err, result) {
                        var nuevainfraccion = "INSERT INTO `infracciones` (`identificador`,`user`, `guild`,`motivo`) VALUES ('" + makeId(7) + "', '" + user.id + "', '" + message.guild.id + "','" + warn + "')";
                        con.query(nuevainfraccion);
                        message.channel.send(`:warning: ${user} ha sido advertido \nRazón: \`${warn}\``);
                        const member = message.guild.member(user);
                        if (cache.activado != 0) {
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
                        }
                    })
                });
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}