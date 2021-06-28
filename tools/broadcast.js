module.exports = {
    name: 'broadcast',
    execute(args, boxen, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, progressbar, result, translate, webp) {
        if (message.author.id === '722810818823192629') {
            client.guilds.each(guild => {
                try {
                    const channel = guild.channels.cache.find(channel => channel.name === 'general') || guild.channels.cache.first();
                    if (channel) {
                        var contenido = message.content;
                        contenido = contenido.replace(global.prefix + 'broadcast ')
                        channel.send(contentido);
                    } else {
                        message.channel.send('The server ' + guild.name + ' has no channels.');
                    }
                } catch (err) {
                    message.channel.send('Could not send message to ' + guild.name + '.');
                }
            });
        }
    }
}