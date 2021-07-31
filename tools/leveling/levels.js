const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'levels',
    execute(args, client, con, contenido, message, result) {
        if (result[0].niveles_activado != 0) {
            var dif = result[0].niveles_dificultad;
            var lookupfortop10 = "SELECT * FROM leveling WHERE guild = " + message.guild.id + " ORDER BY nivel DESC, experiencia DESC LIMIT 10";
            con.query(lookupfortop10, function (err, rows, result) {
                if (result) {
                    if (result.hasOwnProperty(0)) {
                        var embed = new MessageEmbed();
                        embed.setTitle('Ranking')
                        embed.setAuthor(message.guild.name);
                        rows.forEach(function (row) {
                            var usuario = client.users.cache.find(user => user.id === row.user);
                            var nivel = parseInt(row.nivel);
                            var experiencia = parseInt(row.experiencia);
                            embed.addFields({ name: usuario.username, value: "Nivel: " + row.nivel + " | Experiencia: " + (((((nivel - 1) * (nivel - 1)) * dif) * 100) + experiencia) })
                        });
                        embed.setFooter('Para obtener el TOP 10, Pingu ordena de forma descendente los datos de nivel registrados en función del nivel.')
                        message.channel.send(embed);
                    } else {
                        message.channel.send(':information_source: No hay datos suficientes para mostrar el ranking')
                    };
                }
            });
        }
    }
}