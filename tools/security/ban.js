module.exports = {
    name: 'ban',
    execute(args, client, con, contenido, global, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.ban;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var reason = message.content.replace(global.prefix + 'ban ', '');
                var array = message.mentions.users.array();
                var infraccion = message.content;
                array.forEach(user => {
                    reason = infraccion.replace('<@!' + user.id + '>', '');
                })
                message.mentions.users.array().forEach(user => {
                    const member = message.guild.member(user);
                    if (member) {
                        member
                            .ban({
                                reason: reason,
                            })
                            .then(() => {
                                message.channel.send(`:white_check_mark: ${lan.success} ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`:x: ${lan.fail} ${user.tag}`);
                            });
                    }
                });
            } else {
                message.channel.send(`:information_source: ${lan.missing_param}`);
            }
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}