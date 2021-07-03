module.exports = {
    name: 'del',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
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
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}