const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'qpoll',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.functions.qpoll;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                message.channel.send(`:bar_chart: **${message.content.replace(`${result[0].prefix}qpoll `, '')}**`).then(_message => {
                    _message.react('867318329651888128').then(() => {
                        _message.react('867830954541449306');
                    })
                });
                message.delete();
            } else {
                message.channel.send(`:information_source: ${lan.missingquestion}\`${result[0].prefix}qpoll <question>\``)
            }
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}