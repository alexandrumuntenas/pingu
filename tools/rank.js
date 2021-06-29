module.exports = {
    name: 'rank',
    execute(args, boxen, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, progressbar, result, translate, webp) {
        if (result[0].niveles_activado != 0) {
            if (message.mentions.users.first()) {
                var user = message.mentions.users.first();
                if (user.bot) {
                    message.reply(' los bots no reciben experiencia por que son, pues eso, bots.');
                    return
                }
                var dif = result[0].niveles_dificultad;
                var cache = { "aspecto": result[0].niveles_fondo }
                var sql = "SELECT * FROM `leveling` WHERE guild = '" + global.id + "' AND user = '" + user.id + "'";
                // Si no coincide con ningún comando, pasamos al system de leveling
                con.query(sql, function (err, result) {
                    if (result[0]) {
                        var exp = parseInt(result[0].experiencia);
                        var niv = parseInt(result[0].nivel);
                        var required = ((niv ^ 2) * dif) * 100;
                        var progress = progressbar.filledBar(required, exp);
                        var restante = required - exp;
                        var card = boxen(user.username + '#' + user.discriminator + '\n**Nivel** ' + niv + '\n**Experiencia** ' + exp + '\n**Progreso** ' + exp + '/' + required + ' \n' + progress, { padding: 1 });
                        message.channel.send(" <@" + user.id + "> se encuentra en el nivel `" + niv + "` y dispone de `" + ((niv * 100) + exp) + "` puntos de experiencia");
                        message.channel.send(card);
                    } else {
                        message.reply(" no te he podido localizar en la base de datos. Escribe unos cuantos mensajes y vuelve a intentarlo.")
                    }
                })
            } else {
                var dif = result[0].niveles_dificultad;
                var cache = { "aspecto": result[0].niveles_fondo }
                // Si no coincide con ningún comando, pasamos al system de leveling
                con.query("SELECT * FROM `leveling` WHERE guild = '" + global.id + "' AND user = '" + message.author.id + "'", function (err, result) {
                    if (result[0]) {
                        var exp = parseInt(result[0].experiencia);
                        var niv = parseInt(result[0].nivel);
                        async function paso1() {
                            const avatar = new downloader({
                                url: message.author.avatarURL(),
                                directory: "./usuarios/avatares/",
                                fileName: message.author.id + '.webp',
                                cloneFiles: false,
                            });
                            try {
                                await avatar.download();
                            } catch (error) {
                            }
                        }
                        async function paso2() {
                            await webp.dwebp("./usuarios/avatares/" + message.author.id + ".webp", "./usuarios/avatares/" + message.author.id + ".jpg", "-o", logging = "-v");
                        }
                        async function paso3() {
                            const top = await Jimp.read("./usuarios/avatares/" + message.author.id + ".jpg");
                            top.circle();
                            top.resize(220, 220);
                            const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
                            await Jimp.read('./recursos/carteles/' + cache.aspecto + '.png', function (err, image) {
                                image.composite(top, 39, 32);
                                image.print(font, 300, 55, "Nivel: " + niv);
                                image.print(font, 300, 155, "XP: " + ((niv * 100) + exp));
                                image.writeAsync('./usuarios/leveling/' + message.author.id + '_' + global.id + '_rank.jpg')
                                enviar();
                            });
                        }
                        function enviar() {
                            var attachament = new MessageAttachment('./usuarios/leveling/' + message.author.id + '_' + global.id + '_rank.jpg');
                            message.reply(" te encuentras en el nivel `" + niv + "` y dispones de `" + ((niv * 100) + exp) + "` puntos de experiencia", attachament);

                        }
                        async function cocina() {
                            await paso1();
                            await paso2();
                            paso3();
                        }
                        cocina();
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