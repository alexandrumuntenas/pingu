module.exports = {
    name: 'clear-user-warns',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.clearuserwarns;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    var user = message.mentions.users.first();
                    var sql = "DELETE FROM `infracciones` WHERE user = '" + user.id + "' AND guild = '" + message.guild.id + "'";
                    con.query(sql, function (err) {
                        console.log(err)
                        message.channel.send(`:white_check_mark: ${lan.success} ${user}`);
                    })
                } else {
                    message.channel.send(`:information_source: ${lan.atleastoneuser}`);
                }
            }
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}