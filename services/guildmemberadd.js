const { MessageAttachment } = require('discord.js')
const downloader = require('nodejs-file-downloader');
const webp = require('webp-converter');
const Jimp = require('jimp');

module.exports = function (client, con, member) {
    var id = member.guild.id;
    var sql = "SELECT * FROM `servidores` WHERE guild = '" + id + "'";
    //Conectamos con el servidor
    con.query(sql, function (err, result) {
        if (result[0].bienvenida_mensaje_activado != 0) {
            cache = { "canal_id": result[0].bienvenida_canal_id, "canal_msg": result[0].bienvenida_mensaje, "aspecto": result[0].bienvenida_fondo };
            const mensaje = client.channels.cache.find(channel => channel.id === cache.canal_id);
            if (result[0].bienvenida_cartel != 0) {
                var user = member.user;
                async function paso1() {
                    const avatar = new downloader({
                        url: user.avatarURL({ format: 'jpg' }),
                        directory: "./usuarios/avatares/",
                        fileName: user.id + '_join.jpg',
                        cloneFiles: false,
                    });
                    try {
                        await avatar.download();
                        paso2();
                    } catch (e) {
                        console.log(e);
                    }
                }
                async function paso2() {
                    const top = await Jimp.read("./usuarios/avatares/" + user.id + "_join.jpg");
                    top.circle();

                    top.resize(220, 220);
                    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
                    await Jimp.read('./recursos/carteles/' + cache.aspecto + '.png', function (err, image) {
                        image.composite(top, 39, 32);
                        image.print(font, 300, 109, "Hola " + user.tag);
                        image.print(font, 300, 141, "Miembro #" + member.guild.memberCount);
                        image.writeAsync('./usuarios/bienvenidas/' + user.id + '_' + id + '_join.jpg')
                        enviar();
                    });
                }
                function enviar() {
                    //Reemplazamos valores como {user} o {server} para que nodejs pueda interpretarlo
                    const fromdb = cache.canal_msg;
                    const userreplace = fromdb.replace('{user}', `<@${user.id}>`);
                    const toexport = userreplace.replace('{server}', `${member.guild.name}`);
                    var attachament = new MessageAttachment('./usuarios/bienvenidas/' + member.id + '_' + id + '_join.jpg');
                    mensaje.send(toexport, attachament);
                }
                async function cocina() {
                    paso1();
                    if (result[0].burbuja_activado == 1) {
                        if (member) {
                            member
                                .kick('El servidor al que intentas acceder dispone del modo burbuja activado.');
                        }
                    }
                }
                cocina();
            } else {
                //Reemplazamos valores como {user} o {server} para que nodejs pueda interpretarlo
                const fromdb = cache.canal_msg;
                const userreplace = fromdb.replace('{user}', `<@${member.user.id}>`);
                const toexport = userreplace.replace('{server}', `${member.guild.name}`);
                mensaje.send(toexport);
            }
            if (result[0].burbuja_activado == 1) {
                if (member) {
                    member
                        .kick('El servidor al que intentas acceder dispone del modo burbuja activado.');
                }
            }
        }
        if (member.user.bot) {
            if (result[0].bienvenida_roles_bot) {
                var botssss = result[0].bienvenida_roles_bot;
                var role = botssss.split(',')
                role.forEach(element => {
                    member.roles.add(member.guild.roles.cache.find(role => role.id === element));
                })
            }
        } else {
            if (result[0].bienvenida_roles_user) {
                var usersss = result[0].bienvenida_roles_user;
                var role = usersss.split(',');
                role.forEach(element => {
                    member.roles.add(member.guild.roles.cache.find(role => role.id === element));
                })
            }
        }
    });
}