module.exports = {
    name: 'delwarn',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.delwarn;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    if (args[2]) {
                        var borrarwarn = "DELETE FROM guild_warns WHERE guild = " + message.guild.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        var existewarn = "SELECT * FROM guild_warns WHERE guild = " + message.guild.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        con.query(existewarn, function (err, result) {
                            if (result.hasOwnProperty(0)) {
                                con.query(borrarwarn);
                                message.channel.send(`:white_check_mark: ${lan.success} (\`${args[2]}\`)`);
                            } else {
                                message.channel.send(`:information_source: \`${message.mentions.users.first().tag}\` ${lan.userNoHasWarn} \`${args[2]}\``);
                            }
                        });
                    } else {
                        message.channel.send(`:information_source: ${lan.missing_args}: \`${result[0].prefix}delwarn <${lan.usage.param1}> <${lan.usage.param2}>\``);
                    }
                } else {
                    message.channel.send(`:information_source: ${lan.missing_args}: \`${result[0].prefix}delwarn <${lan.usage.param1}> <${lan.usage.param2}>\``);
                }
            } else {
                message.channel.send(`:x: ${lan.permerror}`);
            }
        }
    }
}