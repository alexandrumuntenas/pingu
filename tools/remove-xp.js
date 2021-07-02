module.exports = {
    name: 'remove-xp',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].niveles_activado != 0) {
                function mf2(nivel, experiencia, user) {
                    var sql_actualizar_xp_quitar = "UPDATE `leveling` SET `experiencia` = '" + experiencia + "', `nivel` = '" + nivel + "' WHERE `leveling`.`user` = " + user.id + " AND `leveling`.`guild` = " + global.id;
                    con.query(sql_actualizar_xp_quitar);
                }
                if (parseInt(args[1])) {
                    if (parseInt(args[1]) <= 9999) {
                        if (args[2]) {
                            const user = message.mentions.users.first();
                            var dif = result[0].niveles_dificultad;
                            var sql_niveles_quitar = "SELECT * FROM `leveling` WHERE guild = '" + global.id + "' AND user = '" + user.id + "'";
                            con.query(sql_niveles_quitar, function (err, result) {
                                var exp = parseInt(result[0].experiencia) + (parseInt(result[0].nivel * (dif * 100)))
                                var exp = exp - parseInt(args[1]);
                                var niv = 0;
                                while (exp >= (((niv * niv) * dif) * 100)) {
                                    var exp = exp - (((niv * niv) * dif) * 100);
                                    var niv = niv + 1;
                                    mf2(niv, exp, user);
                                }
                                if (exp < 0) {
                                    var exp = 0;
                                }
                                if (niv < 0) {
                                    var niv = 0;
                                }
                                mf2(niv, exp, user);
                                message.channel.send(':white_check_mark: Se ha establecido los puntos de experiencia de <@' + user.id + '> a `' + exp + '` y el nivel a `' + niv + '`');
                            });
                        } else {
                            message.channel.send(":information_source: El tercer argumento debe ser un @usuario :arrow_right: https://pingu.duoestudios.es/compromiso-diversion-y-aprendizaje/niveles#moderadores");
                        }
                    } else {
                        message.reply(":scream: Debe introducir un valor númerico entre 0 - 9999 :arrow_right: https://pingu.duoestudios.es/compromiso-diversion-y-aprendizaje/niveles#moderadores");
                    }
                } else {
                    message.reply(":information_source: El segundo argumento debe ser un valor númerico :arrow_right: https://pingu.duoestudios.es/compromiso-diversion-y-aprendizaje/niveles#moderadores");
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}