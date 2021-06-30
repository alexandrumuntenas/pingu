module.exports = {
    name: 'rank',
    execute(args, canvacord, client, con, Sentry, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (result[0].niveles_activado != 0) {
            const transaction = Sentry.startTransaction({
                op: "Rank",
                name: "Ejecución del comando en Guild " + global.id,
            });
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
                                Sentry.captureException(e);
                            } finally {
                                transaction.finish();
                            }
                        }
                        fa();
                    } else {
                        message.reply(" no te he podido localizar en la base de datos. Escribe unos cuantos mensajes y vuelve a intentarlo.")
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
                                await webp.dwebp("./usuarios/avatares/" + user.id + ".webp", "./usuarios/avatares/" + user.id + "_level.jpg", "-o", logging = "-v");
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
                                Sentry.captureException(e);
                            } finally {
                                transaction.finish();
                            }
                        }
                        fa();
                    } else {
                        message.reply(" no te he podido localizar en la base de datos. Escribe unos cuantos mensajes y vuelve a intentarlo.")
                    }
                })
            };
        } else {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                message.channel.send(":information_source: Este servidor tiene desactivado el sistema de niveles. Para activarlos, utiliza el siguiente comando: `" + global.prefix + "niveles`");
            } else {
                message.reply(" este servidor tiene desactivado los leveling");
            }
        }
    }
}