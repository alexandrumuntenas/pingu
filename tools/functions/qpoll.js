const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'qpoll',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.functions.qpoll;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                message.channel.send(`:bar_chart: **${message.content.replace(`${result[0].guild_prefix}qpoll `, '')}**`).then(_message => {
                    _message.react('876106253355585627').then(() => {
                        _message.react('876106307269181460');
                    })
                });
                message.delete();
            } else {
                message.channel.send(`<:win_information:876119543968305233> ${lan.missingquestion}\`${result[0].guild_prefix}qpoll <question>\``)
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}