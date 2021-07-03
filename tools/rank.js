const canvacord = require('canvacord');
const downloader = require('nodejs-file-downloader');
const { MessageAttachment } = require('discord.js');
const webp = require('webp-converter');

module.exports = {
    name: 'rank',
    execute(args, client, con, contenido, global, message, result) {
        if (result[0].niveles_activado != 0) {
            var dif = result[0].niveles_dificultad;
            var cache = { "aspecto": result[0].niveles_fondo }
            if (message.mentions.users.first()) {
                var user = message.mentions.users.first();
                if (user.bot) {
                    message.reply(' los bots no reciben experiencia por que son, pues eso, bots.');
                    return
                }
                con.query("SELECT * FROM `leveling` WHERE guild = '" + global.id + "' AND user = '" + user.id + "'", function (err, result) {
                    if (result[0]) {
                        var experiencia = parseInt(result[0].experiencia);
                        var nivel = parseInt(result[0].nivel);
                        async function fa() {
                            const avatar = new downloader({
                                url: user.avatarURL(),
                                directory: "./usuarios/avatares/",
                                fileName: user.id + '_level.webp',
                                cloneFiles: false,
                            });
                            try {
                                await avatar.download();
                                await webp.dwebp("./usuarios/avatares/" + user.id + "_level.webp", "./usuarios/avatares/" + user.id + "_level.jpg", "-o", logging = "-v");
                                var rank = new canvacord.Rank()
                                    .setAvatar("./usuarios/avatares/" + user.id + "_level.jpg")
                                    .setCurrentXP(experiencia)
                                    .setRequiredXP(((nivel * nivel) * dif) * 100)
                                    .setStatus(user.presence.status, true)
                                    .setLevel(nivel, 'NIVEL')
                                    .setProgressBar("#FFFFFF", "COLOR")
                                    .setUsername(user.username)
                                    .setDiscriminator(user.discriminator)
                                    .setRank(0, '', false)
                                    .setBackground("IMAGE", './recursos/carteles/' + cache.aspecto + '.png');

                                rank.build()
                                    .then(buffer => {
                                        canvacord.write(buffer, './usuarios/leveling/' + user.id + '_' + global.id + '_rank.jpg');
                                        var attachament = new MessageAttachment('./usuarios/leveling/' + user.id + '_' + global.id + '_rank.jpg');
                                        message.channel.send(" <@" + user.id + "> se encuentra en el nivel `" + nivel + "` y dispone de `" + (((((nivel - 1) * (nivel - 1)) * dif) * 100) + experiencia) + "` puntos de experiencia", attachament);
                                    });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        fa();
                    } else {
                        message.channel.send(":x: No existen datos disponibles.")
                    }
                })
            } else {
                // Si no coincide con ningún comando, pasamos al system de leveling
                user = message.author;
                con.query("SELECT * FROM `leveling` WHERE guild = '" + global.id + "' AND user = '" + user.id + "'", function (err, result) {
                    if (result[0]) {
                        var experiencia = parseInt(result[0].experiencia);
                        var nivel = parseInt(result[0].nivel);
                        async function fa() {
                            const avatar = new downloader({
                                url: user.avatarURL(),
                                directory: "./usuarios/avatares/",
                                fileName: user.id + '_level.webp',
                                cloneFiles: false,
                            });
                            try {
                                await avatar.download();
                                await webp.dwebp("./usuarios/avatares/" + user.id + "_level.webp", "./usuarios/avatares/" + user.id + "_level.jpg", "-o", logging = "-v");
                                var rank = new canvacord.Rank()
                                    .setAvatar("./usuarios/avatares/" + user.id + "_level.jpg")
                                    .setCurrentXP(experiencia)
                                    .setRequiredXP(((nivel * nivel) * dif) * 100)
                                    .setStatus(user.presence.status, true)
                                    .setLevel(nivel, 'NIVEL')
                                    .setProgressBar("#FFFFFF", "COLOR")
                                    .setUsername(user.username)
                                    .setDiscriminator(user.discriminator)
                                    .setRank(0, '', false)
                                    .setBackground("IMAGE", './recursos/carteles/' + cache.aspecto + '.png');

                                rank.build()
                                    .then(buffer => {
                                        canvacord.write(buffer, './usuarios/leveling/' + user.id + '_' + global.id + '_rank.jpg');
                                        var attachament = new MessageAttachment('./usuarios/leveling/' + user.id + '_' + global.id + '_rank.jpg');
                                        message.channel.send(" <@" + user.id + "> se encuentra en el nivel `" + nivel + "` y dispone de `" + (((((nivel - 1) * (nivel - 1)) * dif) * 100) + experiencia) + "` puntos de experiencia", attachament);
                                    });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        fa();
                    } else {
                        message.reply(" no le he podido localizar en la base de datos. Escriba unos cuantos mensajes y vuelva a intentarlo.")
                    }
                })
            };
        } else {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                message.channel.send(":information_source: Este servidor tiene desactivado el sistema de niveles. Para activarlos, utilice el siguiente comando: `" + global.prefix + "niveles`");
            } else {
                message.channel.send(":information_source: Este servidor tiene desactivado el sistema de niveles");
            }
        }
    }
}