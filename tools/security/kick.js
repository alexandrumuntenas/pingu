module.exports = {
    name: 'kick',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.kick;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var reason = message.content.replace(result[0].prefix + 'kick ', '');
                var array = message.mentions.users.array();
                var infraccion = message.content;
                array.forEach(user => {
                    reason = infraccion.replace('<@!' + user.id + '>', '');
                })
                message.mentions.users.array().forEach(user => {
                    const member = message.guild.member(user);
                    if (member) {
                        member
                            .kick({
                                reason: reason,
                            })
                            .then(() => {
                                message.channel.send(`<:pingu_check:876104161794596964> ${lan.success} ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`<:pingu_cross:876104109256769546> ${lan.fail} ${user.tag}`);
                            });
                    }
                });
            } else {
                message.channel.send(`:information_source: ${lan.missing_param}`);
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}