module.exports = {
    name: 'prefijo',
    execute(client, versionbot, build, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                var sql = "UPDATE `servidores` SET `prefix` = '" + args[1] + "' WHERE `servidores`.`guild` = '" + global.id + "'";
                con.query(sql, function (err) {
                });
                message.channel.send(":white_check_mark: prefijo cambiado de \"" + global.prefix + "\" a \"" + args[1] + "\" correctamente :thumbsup:");
            } else {
                message.channel.send(':information_source: Falta un argumento en el comando. Uso: `' + global.prefix + 'prefijo <prefijo>`');
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}