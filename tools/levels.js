module.exports = {
    name: 'levels',
    execute(args, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (result[0].niveles_activado != 0) {
            var dif = result[0].niveles_dificultad;
            var lookupfortop10 = "SELECT * FROM leveling WHERE guild = " + global.id + " ORDER BY nivel DESC, experiencia DESC LIMIT 10";
            con.query(lookupfortop10, function (err, rows, result) {
                if (result) {
                    if (typeof result[0] !== 'undefined') {
                        var embed = new MessageEmbed();
                        embed.setTitle('Ranking')
                        embed.setAuthor(global.name);
                        rows.forEach(function (row) {
                            var usuario = client.users.cache.find(user => user.id === row.user);
                            embed.addFields({ name: usuario.username, value: "Nivel: " + row.nivel + " | Experiencia: " + ((parseInt(row.nivel) * (dif * 100)) + parseInt(row.experiencia)) })
                        });
                    };
                    embed.setFooter('Para obtener el TOP 10, Wired Penguin ordena de forma descendente los datos de nivel registrados en función del nivel.')
                    message.channel.send(embed);
                }
            });
        }
    }
}