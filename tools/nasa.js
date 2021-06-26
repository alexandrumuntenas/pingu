module.exports = {
    name: 'nasa',
    execute(args, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {

        async function embed(quote) {
            translate(quote.explanation, { to: "es" }).then(res => {
                var embed = new MessageEmbed();
                embed.setTitle(quote.title);
                embed.setDescription(":flag_es: **Traducción:**" + res.text);
                embed.setImage(quote.hdurl);
                embed.setFooter("Imagen por " + quote.copyright);
                message.channel.send(embed);
            });

        }
        fetch('https://api.nasa.gov/planetary/apod?api_key=ezowSxroDnhKvjzojV9SXx7LmZ6P7OndGYLGXuE9')
            .then(response => response.json())
            .then(quote => embed(quote));
    }
}