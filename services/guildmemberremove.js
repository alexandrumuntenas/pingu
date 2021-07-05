module.exports = function (client, con, member) {
    var id = member.guild.id;
    var uid = member.user.id;
    var sql = "SELECT * FROM `servidores` WHERE guild = '" + id + "'";
    var sql1 = "DELETE FROM `leveling` WHERE user = '" + uid + "' AND guild = '" + id + "'";
    var sql2 = "DELETE FROM `infracciones` WHERE user = '" + uid + "' AND guild = '" + id + "'";
    var user = member.user;
    if (member.user.id != client.user.id) {
        con.query(sql, function (err, result) {
            if (result[0].salida_mensaje_activado != 0) {
                cache = { "canal_id": result[0].salida_canal, "canal_msg": result[0].salida_mensaje };
                const mensaje = client.channels.cache.find(channel => channel.id === cache.canal_id);
                if (mensaje) {
                    const fromdb = cache.canal_msg;
                    const userreplace = fromdb.replace('{user}', `${user.tag}`);
                    const toexport = userreplace.replace('{server}', `${member.guild.name}`);
                    mensaje.send(toexport);
                }
            }
            con.query(sql1);
            con.query(sql2);
        })
    }
}