const { MessageEmbed } = require('discord.js')
const makeId = require('../../gen/makeId');
module.exports = {
    name: 'warn',
    execute(args, client, con, contenido, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var lan = require(`../../languages/${result[0].idioma}.json`);
                lan = lan.tools.security.warn;
                var warn = message.content;
                message.mentions.users.array().forEach(user => {
                    warn = warn.replace('<@!' + user.id + '>', '').replace('<@' + user.id + '>', '').replace(`${result[0].prefix}warn`, '');
                })
                message.mentions.users.array().forEach(user => {
                    var cache = { "activado": result[0].moderador_warn_expulsion_activado, "cantidad": result[0].moderador_warn_expulsion_cantidad, "accion": result[0].moderador_warn_expulsion_accion };
                    var consultarcantidad = "SELECT COUNT(*) AS itotal FROM `guild_warns` WHERE user = '" + user.id + "' AND guild = '" + message.guild.id + "'";
                    con.query(consultarcantidad, function (err, result) {
                        var nuevainfraccion = "INSERT INTO `guild_warns` (`identificador`,`user`, `guild`,`motivo`) VALUES ('" + makeId(7) + "', '" + user.id + "', '" + message.guild.id + "','" + warn + "')";
                        con.query(nuevainfraccion);
                        if (warn.trim().length > 0) {
                            message.channel.send(`:warning: ${user} ${lan.success} \n${lan.reason}: \`${warn.trim()}\``);
                        } else {
                            message.channel.send(`:warning: ${user} ${lan.success}`);
                        }
                        const member = message.guild.member(user);
                        if (cache.activado != 0) {
                            if (parseInt(result[0].itotal) + 1 >= cache.cantidad) {
                                if (cache.accion != 0) {
                                    member
                                        .ban({
                                            reason: lan.automod.reason,
                                        })
                                        .then(() => {
                                            message.channel.send(`:police_officer: ${lan.automod.success.a} ${user.tag} ${lan.automod.success.b} ${lan.automod.ban} ${lan.automod.success.c} \`${cache.cantidad}\` ${lan.automod.success.d}`);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.automod.error.a} ${lan.automod.ban} ${lan.automod.error.b} (${user.tag}) ${lan.automod.error.c} \`${cache.cantidad}\` ${lan.automod.error.d}`);
                                        });
                                } else {
                                    member
                                        .kick(lan.automod.reason)
                                        .then(() => {
                                            message.channel.send(`:police_officer: ${lan.automod.success.a} ${user.tag} ${lan.automod.success.b} ${lan.automod.kick} ${lan.automod.success.c} \`${cache.cantidad}\` ${lan.automod.success.d}`);
                                        })
                                        .catch(err => {
                                            console.log(err);
                                            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.automod.error.a} ${lan.automod.kick} ${lan.automod.error.b} (${user.tag}) ${lan.automod.error.c} \`${cache.cantidad}\` ${lan.automod.error.d}`);
                                        });
                                }
                            }
                        }
                    })
                });
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}