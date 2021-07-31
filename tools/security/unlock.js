module.exports = {
    name: 'unlock',
    execute(args, client, con, contenido, global, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.unlock;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
                SEND_MESSAGES: true
            }).then(() => {
                message.channel.send(`:white_check_mark: ${lan.success}`);
            });
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}