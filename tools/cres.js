module.exports = {
    name: 'cres',
    execute(args, client, con, contenido, global, message, result) {
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
                        var identificador = makeId(7);
                        message.reply(':arrow_right: ¿A qué mensaje debo que responder?')
                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                            { max: 1 }).then(collected => {
                                var accionante = collected.first().content;
                                accionante = accionante.toLowerCase();
                                message.channel.send(':arrow_right: ¿Qué debo que responder?')
                                message.channel.awaitMessages(m => m.author.id == message.author.id,
                                    { max: 1 }).then(collected => {
                                        var respuesta = collected.first().content;
                                        var crearcres = "INSERT INTO `respuestas_custom` (`identificador`,`guild`, `action`, `returns`) VALUES ('" + identificador + "','" + global.id + "', '" + accionante + "', '" + respuesta + "')";
                                        con.query(crearcres, function (err) {
                                            console.log(err)
                                            message.channel.send(':white_check_mark: Se ha creado correctamente la respuesta personalizada. Su identificador es: `' + identificador + '`.');
                                        })
                                    }).catch(() => {
                                        message.reply(' se ha producido un error...');
                                    });
                            }).catch(() => {
                                message.reply(' se ha producido un error...');
                            });
                        break;
                    case 'eliminar':
                        var delcmd = "DELETE FROM `respuestas_custom` WHERE `identificador` = '" + args[2] + "' AND `guild` = " + global.id;
                        con.query(delcmd, function (err) {
                            console.log(err)
                            message.channel.send(':white_check_mark: Se ha eliminado correctamente la respuesta personalizada con identificador `' + args[2] + '`');
                        })
                        break;
                    default:
                        message.channel.send(':information_source: No has indicado una opción correcta :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/respuestas-personalizadas')
                        break;
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando');
        }
    }
}