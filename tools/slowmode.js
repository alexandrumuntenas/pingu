var parse = require('parse-duration')

module.exports = {
    name: 'slowmode',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var timeslowmo1 = message.content.replace(`${global.prefix}slowmode `, '');
                timeslowmo = parse(timeslowmo1, 's');
                message.channel.setRateLimitPerUser(timeslowmo, "Slowmode");
                message.reply(' se ha establecido un slowmode de `' + timeslowmo1 + '` :clock1:');
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}