const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'poll',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            var embed = new MessageEmbed();
            embed.setAuthor(message.author.username, message.author.avatarURL());
            embed.setTimestamp();
            embed.setFooter('Powered by Pingu')
            embed.setColor("#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }));
            message.channel.send(':arrow_right: ¿Qué desea preguntar?');
            message.channel.awaitMessages(m => m.author.id == message.author.id,
                { max: 1 }).then(collected => {
                    embed.setDescription(collected.first().content);
                    embed.setDescription(collected.first().content);
                    message.channel.send(':arrow_right: ¿A dónde desea enviarlo? ¡Mencione el canal!')
                    message.channel.awaitMessages(m => m.author.id == message.author.id,
                        { max: 1 }).then(collected => {
                            var canal = collected.first().mentions.channels.first();
                            const mensaje = client.channels.cache.find(channel => channel.id === canal.id);
                            mensaje.send(embed).then((message) => {
                                message.react('👍').then(() => {
                                    message.react('👎');
                                })
                            });
                            message.channel.send(':white_check_mark: Se ha enviado correctamente el *poll* a <#' + canal.id + '>.');
                        });
                });
        }
    }
}