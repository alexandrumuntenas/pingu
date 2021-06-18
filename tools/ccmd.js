module.exports = {
    name: 'ccmd',
    execute(client, versionbot, build, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (args[1]) {
            switch (args[1]) {
                case 'crear':
                    var motivo = message.content.replace(global.prefix + 'ccmd crear ' + args[2] + '', '');
                    var crearccmd = "INSERT INTO `comandos_custom` (`guild`, `cmd`, `returns`) VALUES ('" + global.id + "', '" + args[2] + "', '" + motivo + "')";
                    con.query(crearccmd, function (err) {
                        if (err) throw err;
                        message.channel.send(':white_check_mark: Se ha creado correctamente el comando personalizado `' + args[2] + '`. Este devolverá el valor especificado `' + motivo + '`');
                    })
                    break;
                case 'eliminar':
                    break;
                case 'listar':
                    break;
            }
        }
    }
}