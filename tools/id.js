module.exports = {
    name: 'id',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, data) {
        let server = message.guild.id;
        message.channel.send(":information_source: El `ID` es `" + server + "`");
    }
}