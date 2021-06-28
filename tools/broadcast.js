module.exports = {
    name: 'broadcast',
    execute(args, boxen, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, progressbar, result, translate, webp) {
        if (message.author.id === '722810818823192629') {
            var contenido = message.content;
            contenido = contenido.replace(global.prefix + 'broadcast ')
            var guildList = client.guilds.array();
            try {
                guildList.forEach(guild => guild.defaultChannel.send('@everyone | ' + contentido));
            } catch (err) {
                message.channel.send("Could not send message to " + guild.name);
            }
        };
    }
}