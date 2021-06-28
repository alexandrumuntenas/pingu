module.exports = {
    name: 'anime',
    execute(args, boxen, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, progressbar, result, translate, webp) {
        function embed(quote) {
            var embed = new MessageEmbed();
            embed.setAuthor(quote.anime);
            embed.setFooter(quote.character);
            embed.setDescription(quote.quote);
            message.channel.send(embed);
        }
        fetch('https://animechan.vercel.app/api/random')
            .then(response => response.json())
            .then(quote => embed(quote));
    }
}