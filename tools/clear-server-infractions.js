module.exports = {
    name: 'clear-server-infractions',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                var sql = "DELETE FROM `infracciones` WHERE guild = '" + global.id + "'";
                con.query(sql, function (err) {
                    console.log(err)
                    message.channel.send(':white_check_mark: Se han eliminado las advertencias de todos los usuarios de este servidor');
                })
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}