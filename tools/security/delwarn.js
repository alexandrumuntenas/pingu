module.exports = {
    name: 'delwarn',
    execute(args, client, con, contenido, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    if (args[2]) {
                        var borrarwarn = "DELETE FROM infracciones WHERE guild = " + message.guild.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        var existewarn = "SELECT * FROM infracciones WHERE guild = " + message.guild.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        con.query(existewarn, function (err, result) {
                            if (result.hasOwnProperty(0)) {
                                con.query(borrarwarn);
                                message.channel.send(':white_check_mark: Se ha eliminado la advertencia (`' + args[2] + '`) del usuario `' + message.mentions.users.first().tag + '` correctamente.');
                            } else {
                                message.channel.send(':information_source: El usuario `' + message.mentions.users.first().tag + '` no dispone de la infracción `' + args[2] + '`.');
                            }
                        });
                    } else {
                        message.channel.send(':information_source: Debe indicar el identificador del warn. Uso: `' + result[0].prefix + 'delwarn <usuario> <id>`');
                    }
                } else {
                    message.channel.send(':information_source: No has mencionado a ningún usuario. Uso: `' + result[0].prefix + 'delwarn <usuario> <id>`');
                }
            } else {
                message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
            }
        }
    }
}