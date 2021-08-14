module.exports = {
    name: 'ban',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.security.ban;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var reason = message.content.replace(`${result[0].guild_prefix}ban `, '');
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
                                message.channel.send(`<:pingu_check:876104161794596964> ${lan.success} ${user.tag}`);
                            })
                            .catch(err => {
                                message.channel.send(`<:pingu_cross:876104109256769546> ${lan.fail} ${user.tag}`);
                            });
                    }
                });
            } else {
                message.channel.send(`<:win_information:876119543968305233> ${lan.missing_param}`);
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}