module.exports = {
    name: 'clear-server-infractions',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var sql = "DELETE FROM `infracciones` WHERE guild = '" + global.id + "'";
                con.query(sql, function (err) {
                    if (err) throw err;
                    message.channel.send(':white_check_mark: Se han eliminado todas las infracciones de todos los usuarios de este servidor correctamente');
                })
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}