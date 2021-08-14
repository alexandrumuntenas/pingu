const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'levels',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        var noavaliable = lan.tools.noavaliable;
        lan = lan.tools.leveling.levels;
        if (result[0].niveles_activado != 0) {
            var dif = result[0].niveles_dificultad;
            var lookupfortop10 = "SELECT * FROM `guild_levels` WHERE guild = " + message.guild.id + " ORDER BY nivel DESC, experiencia DESC LIMIT 10";
            con.query(lookupfortop10, function (err, rows, result) {
                if (result) {
                    if (result.hasOwnProperty(0)) {
                        var embed = new MessageEmbed();
                        embed.setTitle(lan.ranking)
                        embed.setAuthor(message.guild.name);
                        rows.forEach(function (row) {
                            var usuario = client.users.cache.find(user => user.id === row.user);
                            var nivel = parseInt(row.nivel);
                            var experiencia = parseInt(row.experiencia);
                            embed.addFields({ name: usuario.tag, value: `${lan.level}: ${row.nivel} | ${lan.xp}: ${(((((nivel - 1) * (nivel - 1)) * dif) * 100) + experiencia)}` })
                        });
                        message.channel.send(embed);
                    } else {
                        message.channel.send(`<:win_information:876119543968305233> ${lan.nodata}`)
                    };
                }
            });
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${noavaliable}`);
        }
    }
}