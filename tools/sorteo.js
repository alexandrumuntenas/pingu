module.exports = {
    name: 'sorteo',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, data) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].ccaa_activado != 0) {
                if (message.mentions.channels.first()) {
                    var canal = message.mentions.channels.first().id;
                } else {
                    var canal = message.channel.id;
                }
                var author = message.author;
                var item = "";
                var time;
                message.reply(' ¿qué vas a sortear?')
                var objeto = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                objeto.on('collect', message => {
                    var item = message.content;
                    message.reply(' ¿cuanto durará el sorteo? (**s**engudos/**m**inutos/**d**ías)');
                    var tiempo = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
                    tiempo.on('collect', message => {
                        var mensaje = client.channels.cache.find(channel => channel.id === canal);
                        var time = message.content;
                        var winnerCount;
                        if (!time) {
                            return message.reply(` has proporcionado una duración inválida. Valores aceptados (s/m/d)`);
                        }
                        if (!item) {
                            item = "Indefinido"
                        }
                        var embed = new MessageEmbed();
                        embed.setColor(0x3333ff);
                        embed.setTitle("¡Nuevo Sorteo!");
                        embed.setDescription('¡Reacciona a este mensaje con 🎉 para participar!')
                        embed.addField(`Se está sorteando`, item);
                        embed.addField(`Duración: `, msi(msi(time), {
                            long: true
                        }), true);
                        embed.setFooter("Powered by Wired Penguin");
                        embed.setAuthor(author.username, author.avatarURL());
                        mensaje.send(embed).then(embedMessage => {
                            embedMessage.react("🎉");
                            setTimeout(async () => {
                                try {
                                    const peopleReactedBot = await embedMessage.reactions.cache.get("🎉").users.fetch();
                                    var peopleReacted = peopleReactedBot.array().filter(u => u.id !== client.user.id);
                                } catch (e) {
                                    return message.channel.send(`Ocurrió un error desconocido durante el sorteo de **${item}** : ` + "`" + e + "`")
                                }
                                var winner;

                                if (peopleReacted.length <= 0) {
                                    return message.channel.send(`No hay suficientes participantes para ejecutar el sorteo de **${item}** :(`);
                                } else {
                                    var index = Math.floor(Math.random() * peopleReacted.length);
                                    winner = peopleReacted[index];
                                }
                                if (!winner) {
                                    mensaje.send(`Ocurrió un error desconocido durante el sorteo de **${item}**`);
                                } else {
                                    mensaje.send(`!🎉 **${winner.toString()}** ha ganado el sorteo de **${item}**! ¡Felicidades! 🎉`);
                                }
                            }, msi(time));
                        });
                    });
                })
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}