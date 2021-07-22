module.exports = {
    name: 'del',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    message.channel.messages.fetch({
                        limit: args[1]
                    }).then((messages) => {
                        const botMessages = [];
                        message.channel.bulkDelete(1, true)
                        messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => botMessages.push(msg))
                        message.channel.bulkDelete(botMessages).then(() => {
                            message.channel.send("Se han eliminado los mensajes de `" + message.mentions.users.first().tag + "` en un rango de `" + args[1] + "` mensajes").then(msg => msg.delete({
                                timeout: 3000
                            }))
                        });
                    })
                } else {
                    if (args[1]) {
                        var i = parseInt(args[1]);
                        if (i < 999 && i > 0) {
                            message.channel.bulkDelete(i + 1, true)
                                .then((_message) => {
                                    message.channel
                                        .send(`He eliminado \`${_message.size - 1}\` mensajes :broom:`).then((sent) => {
                                            setTimeout(() => {
                                                sent.delete();
                                            }, 2500);
                                        });;
                                });

                        } else {
                            message.channel.send(':information_source: Introduzca un valor entre 1-99. Por ejemplo: ' + global.prefix + 'del 65');
                        }
                    } else {
                        message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'del <cantidad>`');
                    }
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}