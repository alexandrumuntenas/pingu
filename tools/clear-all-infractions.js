module.exports = {
    name: 'clear-all-infractions',
    execute(args, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    var user = message.mentions.users.first();
                    var sql = "DELETE FROM `infracciones` WHERE user = '" + user.id + "' AND guild = '" + global.id + "'";
                    con.query(sql, function (err) {
                        if (err) throw err;
                        message.channel.send(':white_check_mark: Se han eliminado todas las infracciones de <@!' + user.id + '> correctamente');
                    })
                } else {
                    message.channel.send(':white_check_mark: Debes mencionar un usuario para poder retirarle todas las infracciones.');
                }
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}