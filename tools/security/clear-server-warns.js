module.exports = {
    name: 'clear-server-warns',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.security.clearserverwarns;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var sql = "DELETE FROM `guild_warns` WHERE guild = '" + message.guild.id + "'";
                con.query(sql, function (err) {
                    console.log(err)
                    message.channel.send(`<:pingu_check:876104161794596964> ${lan.success}`);
                })
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`);
        }
    }
}