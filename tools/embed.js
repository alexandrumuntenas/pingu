module.exports = {
    name: 'embed',
    execute(libraries) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (message.mentions.channels.first()) {
                var canal = message.mentions.channels.first();
                message.reply(' indica el título del mensaje enriquecido');
                var respuesta = ':x: No ha habido respuesta por más de 30 segundos... Acción cancelada';
                var embed = new MessageEmbed();
                embed.setAuthor(message.author.username, message.author.avatarURL());
                embed.setFooter('Powered by Wired Penguin')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        embed.setTitle(collected.first());
                        message.reply(' indica la descripción del mensaje enriquecido')
                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                            { max: 1 }).then(collected => {
                                embed.setDescription(collected.first());
                                const mensaje = client.channels.cache.find(channel => channel.id === canal.id);
                                mensaje.send(embed);
                                message.reply(':white_check_mark: Se ha enviado correctamente el mensaje a <#' + canal + '>');
                            }).catch(() => {
                                message.reply(respuesta);
                            });
                    }).catch(() => {
                        message.channel.send(respuesta);
                    });
            } else {
                message.channel.send(':information_source: Te falta especificar un canal. Uso: `' + data.server.prefix + 'embed <canal>`');
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}