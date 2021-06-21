module.exports = {
    name: 'levels',
    execute(client, versionbot, build, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (result[0].niveles_activado != 0) {
            var dif = result[0].niveles_dificultad;
            var lookupfortop10 = "SELECT * FROM leveling WHERE guild = " + global.id + " ORDER BY nivel DESC LIMIT 10";
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
                    embed.setFooter('Para obtener el TOP 10, Wired Penguin ordena de forma descendente los datos de nivel registrados.')
                    message.channel.send(embed);
                }
            });
        }
    }
}