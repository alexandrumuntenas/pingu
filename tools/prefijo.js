module.exports = {
    name: 'prefijo',
    execute(args, client, con, contenido, downloader, dominantcolor, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                var sql = "UPDATE `servidores` SET `prefix` = '" + args[1] + "' WHERE `servidores`.`guild` = '" + global.id + "'";
                con.query(sql, function (err) {
                });
                message.channel.send(":white_check_mark: Prefijo cambiado de \"" + global.prefix + "\" a \"" + args[1] + "\" correctamente :thumbsup:");
            } else {
                message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'prefijo <prefijo>`');
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}