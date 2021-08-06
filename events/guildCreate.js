module.exports = function (client, con, member) {
    var id = guild.id;
    var chx = guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
    var sql = "INSERT INTO `servidores` (`guild`, `prefix`,`idioma`,`bienvenida_canal_id`,`bienvenida_mensaje`,`salida_canal`,`salida_mensaje`,`niveles_canal_id`,`niveles_canal_mensaje`) VALUES (" + id + ", '/','en','" + chx.id + "','Bienvenido {user} a {server}','" + chx.id + "','¡Adiós {user}!','" + chx.id + "','GG! {user} ha subido al nivel {nivel-nuevo}');";
    var desql = "SELECT * FROM `servidores` WHERE `guild` LIKE " + id;
    con.query(desql, function (err, result) {
        console.log(err)
        if (!result[0]) {
            con.query(sql, function (err, result) {
                console.log(err)
            });
        }
    });
}