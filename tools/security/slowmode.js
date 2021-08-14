var parse = require('parse-duration')

module.exports = {
    name: 'slowmode',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.slowmode;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (args[1]) {
                    var timeslowmo1 = message.content.replace(`${result[0].guild_prefix}slowmode `, '');
                    timeslowmo = parse(timeslowmo1, 's');
                    message.channel.setRateLimitPerUser(timeslowmo, "Slowmode");
                    message.channel.send(`:clock1: ${lan.success} **${timeslowmo1}**`);
                }
            } else {
                message.channel.send(`<:win_information:876119543968305233> ${lan.missing_args}`);
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}