module.exports = {
    name: 'moderador',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            var valor = result[0].moderador_activado;
            if (valor == 1) {
                var fin = 0;
            } else {
                var fin = 1;
            }
            var sql = "UPDATE `servidores` SET `moderador_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
            if (fin == 0) {
                var response = 'desactivado';
            } else {
                var response = 'activado';
            }
            con.query(sql);
            message.channel.send(':white_check_mark: He ' + response + ' correctamente el módulo de moderación.');
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}