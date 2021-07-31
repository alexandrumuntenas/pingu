module.exports = {
    name: 'clear-server-warns',
    execute(args, client, con, contenido, message, result) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var sql = "DELETE FROM `infracciones` WHERE guild = '" + message.guild.id + "'";
                con.query(sql, function (err) {
                    console.log(err)
                    message.channel.send(':white_check_mark: Se han eliminado las advertencias de todos los usuarios de este servidor');
                })
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}