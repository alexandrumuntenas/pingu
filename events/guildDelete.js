module.exports = function (con, guild) {
    var id = guild.id;
    var sql = "DELETE FROM `guild_data` WHERE guild = '" + id + "'";
    var sql1 = "DELETE FROM `leveling` WHERE guild = '" + id + "'";
    var sql2 = "DELETE FROM `guild_warns` WHERE guild = '" + id + "'";
    var sql3 = "DELETE FROM `comandos_custom` WHERE guild = '" + id + "'";
    var sql4 = "DELETE FROM `respuestas_custom` WHERE guild = '" + id + "'";
    con.query(sql, function (err, result) {
        if (err) console.log(err);
        con.query(sql1);
        con.query(sql2);
        con.query(sql2);
        con.query(sql3);
        con.query(sql4);
    });
}