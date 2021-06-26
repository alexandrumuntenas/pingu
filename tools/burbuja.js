module.exports = {
    name: 'burbuja',
    execute(args, client, con, contenido, downloader, dominantcolor, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {

            var valor = result[0].burbuja_activado;
            if (valor == 1) {
                var fin = 0;
                var response = 'desactivado';
            } else {
                var fin = 1;
                var response = 'activado';
            }
            var sql = "UPDATE `servidores` SET `burbuja_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
            message.channel.send(':white_check_mark: He ' + response + ' correctamente el modo burbuja.');
            con.query(sql);
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}