const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'poll',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send(`:bar_chart: **${message.content.replace(`${global.prefix}poll `, '')}**`).then(_message => {
                _message.react('867318329651888128').then(() => {
                    _message.react('867830954541449306');
                })
            });
            message.delete();
        }
    }
}