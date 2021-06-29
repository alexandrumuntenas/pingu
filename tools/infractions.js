module.exports = {
    name: 'infractions',
    execute(args, canvacord, client, con, Sentry, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    const user = message.mentions.users.first();
                    var verinfracciones5 = "SELECT * FROM `infracciones` WHERE `guild` = '" + global.id + "' AND `user` = '" + user.id + "' LIMIT 5";
                    var verinfraccionescantidad = "SELECT COUNT(*) as total FROM `infracciones` WHERE `guild` = '" + global.id + "' AND `user` = '" + user.id + "'";

                    con.query(verinfraccionescantidad, function (err, result) {
                        var ultimas = result[0].total;
                        con.query(verinfracciones5, function (err, result) {
                            var embed = new MessageEmbed().setAuthor("Infracciones de " + user.tag, user.displayAvatarURL()).setTitle('Infracciones totales').setDescription(ultimas);
                            async function infraccionestotales() {
                                var i = 0;
                                for (var i = 0; i < result.length; i++) {
                                    var timeStamp = JSON.stringify(result[i].timestamp);
                                    var s = timeStamp;
                                    var m = moment(s, 'YYYY MM dd').format('MM-DD-YYYY');
                                    embed.addFields({ name: 'Infracción #' + (i + 1), value: "**" + result[i].motivo + "** • " + s.slice(0, 11) + "\"" })
                                }
                                message.channel.send(embed);
                            }
                            infraccionestotales();
                        })
                    })
                } else {
                    message.channel.send(':information_source: no has mencionado a ningún usuario. Uso: `' + global.prefix + 'infractions <usuario>`');
                }
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}