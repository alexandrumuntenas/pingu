module.exports = {
    name: 'tirar',
    execute(args, client, con, contenido, downloader, dominantcolor, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (args[1]) {
            var aleatorio = Math.round(Math.random(1, parseInt(args[1])));
            message.channel.send(':teacher: Tras varias cuentas supercomplicadas, el número generado es `' + aleatorio + '`');
        } else {
            var aleatorio = Math.round(Math.random(1, 100));
            message.channel.send(':teacher: Tras varias cuentas supercomplicadas, el número generado es `' + aleatorio + '`');
        }
    }
}