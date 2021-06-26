module.exports = {
    name: 'id',
    execute(args, client, con, contenido, downloader, dominantcolor, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        let server = message.guild.id;
        message.channel.send(":information_source: El `ID` es `" + server + "`");
    }
}