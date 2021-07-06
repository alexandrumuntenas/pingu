module.exports = {
    name: 'lock',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.updateOverwrite(message.channel.guild.roles.everyone, {
                SEND_MESSAGES: false
            }).then(() => {
                message.channel.send(':white_check_mark: Se ha bloqueado el canal correctamente. Para desbloquearlo, ejecute `' + global.prefix + 'unlock`');
            });
        }
    }
}