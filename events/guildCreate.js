module.exports = function (con, guild) {
    var chx = message.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
    con.query("SELECT * FROM `guild_data` WHERE `guild` LIKE ?", [message.guild.id], function (err, result) {
        if(err) console.log(err);
        if (!result[0]) {
            con.query("INSERT INTO `guild_data` (`guild`, `guild_prefix`,`guild_language`,`welcome_channel`,`welcome_message`,`farewell_channel`,`farewell_message`,`leveling_rankup_channel`,`leveling_rankup_message`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",[message.guild.id, '/' ,'en', chx.id, 'Bienvenido {user} a {server}', chx.id, '¡Adiós {user}!', chx.id, 'GG! {user} ha subido al nivel {nivel-nuevo}'], function (err, result) {
                console.log(err)
            });
        }
    });
}