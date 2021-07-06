module.exports = {
    name: 'unlock',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
                SEND_MESSAGES: true
            }).then(() => {
                message.channel.send(':white_check_mark: Se ha desbloqueado el canal correctamente');
            });
        }
    }
}