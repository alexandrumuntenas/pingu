module.exports = {
    name: 'modwarn',
    execute(args, boxen, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, progressbar, result, translate, webp) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'cantidad':
                        if (args[2]) {
                            var cantidad = parseInt(args[2]);
                            var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_cantidad` = '" + cantidad + "' WHERE `servidores`.`guild` = " + global.id;
                            con.query(sql);
                            message.channel.send(':white_check_mark: Se ha actualizado la cantidad correctamente.');
                        } else {
                            message.channel.send(':information_source: Debes especificar un valor numérico. Uso: `' + global.prefix + 'modwarn cantidad <cantidad>`');
                        }
                        break;
                    case 'accion':
                        var valor = result[0].moderador_warn_expulsion_accion;
                        if (valor == 1) {
                            var fin = 0;
                            var response = 'expulsar';
                        } else {
                            var fin = 1;
                            var response = 'banear';
                        }
                        var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_accion` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                        message.channel.send(':information_source: Se ha cambiado correctamente la acción a tomar a `' + response + '`');
                        con.query(sql);
                        break;
                        break;
                    default:
                        message.reply(':information_source: No has indicado una configuración válida. Por favor, consulta la documentación :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/moderador#infracciones');
                        break;
                }
            } else {
                var valor = result[0].moderador_warn_expulsion_activado;
                if (valor == 1) {
                    var fin = 0;
                    var response = 'desactivado';
                } else {
                    var fin = 1;
                    var response = 'activado';
                }
                var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                message.channel.send(':white_check_mark: He ' + response + ' correctamente el `auto-ban` y el `auto-kick` del comando `warn` :wink:').then((sent) => {
                    setTimeout(() => {
                        sent.delete();
                    }, 5500);
                });
                con.query(sql);
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}