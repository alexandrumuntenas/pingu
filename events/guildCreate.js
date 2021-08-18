module.exports = function (con, guild) {
    var id = guild.id;
    var chx = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
    var sql = "INSERT INTO `guild_data` (`guild`, `guild_prefix`,`guild_language`,`welcome_channel`,`welcome_message`,`farewell_channel`,`farewell_message`,`leveling_rankup_channel`,`leveling_rankup_message`) VALUES (" + id + ", '/','en','" + chx.id + "','Bienvenido {user} a {server}','" + chx.id + "','¡Adiós {user}!','" + chx.id + "','GG! {user} ha subido al nivel {nivel-nuevo}');";
    var desql = "SELECT * FROM `guild_data` WHERE `guild` LIKE " + id;
    con.query(desql, function (err, result) {
        console.log(err)
        if (!result[0]) {
            con.query(sql, function (err, result) {
                console.log(err)
            });
        }
    });
}