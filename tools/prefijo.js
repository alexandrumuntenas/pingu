module.exports = {
    name: 'prefijo',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, data) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                var sql = "UPDATE `servidores` SET `prefix` = '" + args[1] + "' WHERE `servidores`.`guild` = '" + data.server.id + "'";
                con.query(sql, function (err) {
                });
                message.channel.send(":white_check_mark: Prefijo cambiado de \"" + data.server.prefix + "\" a \"" + args[1] + "\" correctamente :thumbsup:");
            } else {
                message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + data.server.prefix + 'prefijo <prefijo>`');
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}