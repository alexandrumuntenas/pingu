module.exports = {
    name: 'clear-server-infractions',
    execute(libraries) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var sql = "DELETE FROM `infracciones` WHERE guild = '" + data.server.id + "'";
                con.query(sql, function (err) {
                    if (err) throw err;
                    message.channel.send(':white_check_mark: Se han eliminado todas las infracciones de todos los usuarios de este servidor correctamente');
                })
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}