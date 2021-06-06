module.exports = function (con, guild) {
    var id = guild.id;
    var sql = "DELETE FROM `servidores` WHERE guild = '" + id + "'";
    var sql1 = "DELETE FROM `leveling` WHERE guild = '" + id + "'";
    var sql2 = "DELETE FROM `infracciones` WHERE guild = '" + id + "'";
    con.query(sql, function (err, result) {
        if (err) throw err;
        con.query(sql1);
        con.query(sql2);
    });
}