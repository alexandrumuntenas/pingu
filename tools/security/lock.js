module.exports = {
    name: 'lock',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.lock;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
                SEND_MESSAGES: false
            }).then(() => {
                message.channel.send(`:white_check_mark: ${lan.success} \`${result[0].prefix}unlock\``);
            });
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}