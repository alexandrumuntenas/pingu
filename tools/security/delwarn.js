module.exports = {
    name: 'delwarn',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.security.delwarn;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderator_enabled != 0) {
                if (message.mentions.users.first()) {
                    if (args[2]) {
                        var borrarwarn = "DELETE FROM guild_warns WHERE guild = " + message.guild.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        var existewarn = "SELECT * FROM guild_warns WHERE guild = " + message.guild.id + " AND user = " + message.mentions.users.first().id + " AND identificador = '" + args[2] + "'";
                        con.query(existewarn, function (err, result) {
                            if (result.hasOwnProperty(0)) {
                                con.query(borrarwarn);
                                message.channel.send(`<:pingu_check:876104161794596964> ${lan.success} (\`${args[2]}\`)`);
                            } else {
                                message.channel.send(`<:win_information:876119543968305233> \`${message.mentions.users.first().tag}\` ${lan.userNoHasWarn} \`${args[2]}\``);
                            }
                        });
                    } else {
                        message.channel.send(`<:win_information:876119543968305233> ${lan.missing_args}: \`${result[0].guild_prefix}delwarn <${lan.usage.param1}> <${lan.usage.param2}>\``);
                    }
                } else {
                    message.channel.send(`<:win_information:876119543968305233> ${lan.missing_args}: \`${result[0].guild_prefix}delwarn <${lan.usage.param1}> <${lan.usage.param2}>\``);
                }
            } else {
                message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`);
            }
        }
    }
}