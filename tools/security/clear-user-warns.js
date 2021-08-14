module.exports = {
    name: 'clear-user-warns',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.security.clearuserwarns;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderator_enabled != 0) {
                if (message.mentions.users.first()) {
                    var user = message.mentions.users.first();
                    var sql = "DELETE FROM `guild_warns` WHERE user = '" + user.id + "' AND guild = '" + message.guild.id + "'";
                    con.query(sql, function (err) {
                        console.log(err)
                        message.channel.send(`<:pingu_check:876104161794596964> ${lan.success} ${user}`);
                    })
                } else {
                    message.channel.send(`<:win_information:876119543968305233> ${lan.atleastoneuser}`);
                }
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}