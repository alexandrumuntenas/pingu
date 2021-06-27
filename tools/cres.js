module.exports = {
    name: 'cres',
    execute(args, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            function makeId(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() *
                        charactersLength));
                }
                return result;
            }
            if (args[1]) {
                switch (args[1]) {
                    case 'crear':
                        var identificador = makeId(3);
                        message.reply(':arrow_right: ¿A qué mensaje tengo que responder?')
                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                            { max: 1 }).then(collected => {
                                var accionante = collected.first();
                                message.channel.send(':arrow_right: ¿Qué tengo que responder?')
                                message.channel.awaitMessages(m => m.author.id == message.author.id,
                                    { max: 1 }).then(collected => {
                                        var respuesta = collected.first();
                                        var crearccmd = "INSERT INTO `respuestas_custom` (`identificador`,`guild`, `cmd`, `returns`) VALUES ('" + identificador + "','" + global.id + "', '" + accionante + "', '" + respuesta + "')";
                                        con.query(crearccmd, function (err) {
                                            if (err) throw err;
                                            message.channel.send(':white_check_mark: Se ha creado correctamente la respuesta personalizada. Su identificador es: `' + identificador + '`.');
                                        })
                                    }).catch(() => {
                                        message.reply(respuesta);
                                    });
                            }).catch(() => {
                                message.reply(respuesta);
                            });
                        break;
                    case 'eliminar':
                        var delcmd = "DELETE FROM `respuestas_custom` WHERE `identificador` = '" + args[2] + "' AND `guild` = " + global.id;
                        con.query(delcmd, function (err) {
                            if (err) throw err;
                            message.channel.send(':white_check_mark: Se ha eliminado correctamente la respuesta personalizada con identificador `' + args[2] + '`');
                        })
                        break;
                    default:
                        message.channel.send(':information_source: No has indicado una opción correcta :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/respuestas-personalizadas')
                        break;
                }
            }
        } else {
            message.channel.send(':x: No tienes permisos suficientes para ejecutar este comando');
        }
    }
}