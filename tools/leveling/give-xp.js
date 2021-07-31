const Math = require('mathjs');

module.exports = {
    name: 'give-xp',
    execute(args, client, con, contenido, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].niveles_activado != 0) {
                function mf2(nivel, experiencia, user) {
                    var sql_actualizar_xp_dar = "UPDATE `leveling` SET `experiencia` = '" + experiencia + "', `nivel` = '" + nivel + "' WHERE `leveling`.`user` = " + user.id + " AND `leveling`.`guild` = " + message.guild.id;
                    con.query(sql_actualizar_xp_dar);
                }
                if (parseInt(args[1])) {
                    if (parseInt(args[1]) <= 9999) {
                        if (message.mentions.users.first()) {
                            const user = message.mentions.users.first();
                            var dif = result[0].niveles_dificultad;
                            var sql_niveles_dar = "SELECT * FROM `leveling` WHERE guild = '" + message.guild.id + "' AND user = '" + user.id + "'";
                            con.query(sql_niveles_dar, function (err, result) {
                                var exp = parseInt(result[0].experiencia) + (parseInt(result[0].nivel * (dif * 100)));
                                var exp = exp + parseInt(args[1]);
                                var niv = 0;
                                while (exp >= (((niv * niv) * dif) * 100)) {
                                    var exp = exp - (((niv * niv) * dif) * 100);
                                    var niv = niv + 1;
                                    mf2(niv, exp, user);
                                    console.log(exp);
                                }
                                if (exp != 0) {
                                    var exp = Math.abs(exp);
                                }
                                mf2(niv, exp, user);
                                message.channel.send(':white_check_mark: Se ha establecido los puntos de experiencia de <@' + user.id + '> a `' + exp + '` y el nivel a `' + niv + '`');
                            });
                        } else {
                            message.channel.send(":information_source: El segundo argumento debe ser un @usuario :arrow_right: https://pingu.duoestudios.es/compromiso-diversion-y-aprendizaje/niveles#moderadores");
                        }
                    } else {
                        message.channel.send(":scream: Debe introducir un valor númerico entre 0 - 9999 :arrow_right: https://pingu.duoestudios.es/compromiso-diversion-y-aprendizaje/niveles#moderadores");
                    }
                } else {
                    message.channel.send(":information_source: El primer argumento debe ser un valor númerico :arrow_right: https://pingu.duoestudios.es/compromiso-diversion-y-aprendizaje/niveles#moderadores");
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}