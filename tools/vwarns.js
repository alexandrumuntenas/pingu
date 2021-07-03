const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'vwarns',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    const user = message.mentions.users.first();
                    var verinfracciones5 = "SELECT * FROM `infracciones` WHERE `guild` = '" + global.id + "' AND `user` = '" + user.id + "' ORDER BY timestamp DESC LIMIT 25";
                    var verinfraccionescantidad = "SELECT COUNT(*) as total FROM `infracciones` WHERE `guild` = '" + global.id + "' AND `user` = '" + user.id + "'";

                    con.query(verinfraccionescantidad, function (err, result) {
                        var ultimas = result[0].total;
                        con.query(verinfracciones5, function (err, result) {
                            var embed = new MessageEmbed().setAuthor("Advertencias de " + user.tag, user.displayAvatarURL()).setTitle('Advertencias totales: ' + ultimas);
                            async function infraccionestotales() {
                                var i = 0;
                                for (var i = 0; i < result.length; i++) {
                                    var timeStamp = JSON.stringify(result[i].timestamp);
                                    var s = timeStamp;
                                    var m = moment(s, 'YYYY MM dd').format('MM-DD-YYYY');
                                    embed.addFields({ name: 'Advertencia #' + (i + 1) + "(" + result[i].identificador + ")", value: "**" + result[i].motivo + "** • " + s.slice(0, 11) + "\"" })
                                }
                                message.channel.send(embed);
                            }
                            infraccionestotales();
                        })
                    })
                } else {
                    message.channel.send(':information_source: no ha mencionado a ningún usuario. Uso: `' + global.prefix + 'vwarns <usuario>`');
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}