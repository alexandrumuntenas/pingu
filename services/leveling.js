const { MessageAttachment } = require('discord.js');
const webp = require('webp-converter');
const Jimp = require('jimp');
const downloader = require('nodejs-file-downloader');

module.exports = function (result, client, con, message, global) {
    var cache = { "canal_id": result[0].niveles_canal_id, "canal_msg": result[0].niveles_canal_mensaje, "aspecto": result[0].niveles_fondo };
    var dif = result[0].niveles_dificultad;
    con.query("SELECT * FROM `leveling` WHERE guild = '" + global.id + "' AND user = '" + message.author.id + "'", function (err, result) {
        if (result[0]) {
            var exp = parseInt(result[0].experiencia);
            var niv = parseInt(result[0].nivel);
            var exp = exp + Math.round(Math.random(15, 25));

            if (exp >= (((niv * niv) * dif) * 100)) {
                var exp = 0;
                var niv = niv + 1;
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
                        console.log(error);
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
                        image.print(font, 300, 55, (niv - 1) + " -> " + niv);
                        image.print(font, 300, 155, 'Nuevo nivel');
                        image.writeAsync('./usuarios/leveling/' + message.author.id + '_' + global.id + '.jpg');
                        enviar();
                    });
                }
                function enviar() {
                    const fromdb = cache.canal_msg;
                    const member = fromdb.replace('{user}', `<@${message.author.id}>`);
                    const nivold = member.replace('{nivel-antiguo}', `${niv - 1}`);
                    const toexport = nivold.replace('{nivel-nuevo}', `${niv}`);
                    if (cache.cartelactivado != 0) {
                        var attachament = new MessageAttachment('./usuarios/leveling/' + message.author.id + '_' + global.id + '.jpg');
                        if (cache.canal_id) {
                            const mensaje = client.channels.cache.find(channel => channel.id === cache.canal_id);
                            mensaje.send(toexport + ". Puedes consultar tu rango usando `" + global.prefix + "rank`", attachament);
                        } else {
                            message.channel.send(toexport + ". Puedes consultar tu rango usando `" + global.prefix + "rank`", attachament);
                        }
                    } else {
                        if (cache.canal_id) {
                            mensaje.send(toexport + ". Puedes consultar tu rango usando `" + global.prefix + "rank`");
                        } else {
                            message.channel.send(toexport + ". Puedes consultar tu rango usando `" + global.prefix + "rank`", attachament);
                        }
                    }
                }
                async function cocina() {
                    if (cache.cartelactivado != 0) {
                        await paso1();
                        await paso2();
                        await paso3();

                    } else {
                        enviar();
                    }
                }
                cocina();
            }
            var actualizardatos = "UPDATE `leveling` SET `experiencia` = '" + exp + "', `nivel` = '" + niv + "' WHERE `user` = '" + message.author.id + "' AND `guild` = '" + global.id + "'";
            con.query(actualizardatos);
        } else {
            var newuser = "INSERT INTO `leveling` (`user`, `guild`) VALUES ('" + message.author.id + "', '" + global.id + "')";
            con.query(newuser);
        }
    });
}