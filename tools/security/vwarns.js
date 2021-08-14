const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'vwarns',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.security.vwarns;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    const user = message.mentions.users.first();
                    var verinfracciones5 = "SELECT * FROM `guild_warns` WHERE `guild` = '" + message.guild.id + "' AND `user` = '" + user.id + "' ORDER BY timestamp DESC LIMIT 25";
                    var verinfraccionescantidad = "SELECT COUNT(*) as total FROM `guild_warns` WHERE `guild` = '" + message.guild.id + "' AND `user` = '" + user.id + "'";

                    con.query(verinfraccionescantidad, function (err, result) {
                        var ultimas = result[0].total;
                        con.query(verinfracciones5, function (err, result) {
                            var embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL()).setTitle(lan.title).setDescription('Advertencias totales: ' + ultimas);
                            async function infraccionestotales() {
                                var i = 0;
                                for (var i = 0; i < result.length; i++) {
                                    var timeStamp = JSON.stringify(result[i].timestamp);
                                    var s = timeStamp;
                                    var m = moment(s, 'YYYY MM dd').format('MM-DD-YYYY');
                                    embed.addFields({ name: `${lan.warning} (${result[i].identificador})`, value: "**" + result[i].motivo + "** • " + s.slice(0, 11) + "\"" }).setTimestamp()
                                }
                                message.channel.send(embed);
                            }
                            infraccionestotales();
                        })
                    })
                } else {
                    message.channel.send(`<:win_information:876119543968305233> ${lan.newdmpromotion}`);
                }
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}