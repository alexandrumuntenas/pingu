module.exports = {
    name: 'clear',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.security.clear;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    message.channel.messages.fetch({
                        limit: args[1]
                    }).then((messages) => {
                        const botMessages = [];
                        message.channel.bulkDelete(1, true)
                        messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => botMessages.push(msg))
                        message.channel.bulkDelete(botMessages).then((_message) => {
                            message.channel.send(`:broom: \`${_message.size - 1}\` ${lan.success}`).then(msg => msg.delete({
                                timeout: 2500
                            }))
                        });
                    })
                } else {
                    if (args[1]) {
                        var i = parseInt(args[1]);

                        message.channel.bulkDelete(i + 1, true)
                            .then((_message) => {
                                message.channel
                                    .send(`:broom: \`${_message.size - 1}\` ${lan.success}`).then((sent) => {
                                        setTimeout(() => {
                                            sent.delete();
                                        }, 2500);
                                    });;
                            });
                    } else {
                        message.channel.send(`:information_source: ${lan.missing_arg} \`${result[0].prefix}del <cantidad> \``);
                    }
                }
            }
        } else {
            message.channel.send(`<:pingu_false:876103413526564924> ${lan.permerror}`);
        }
    }
}