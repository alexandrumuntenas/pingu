module.exports = {
    name: 'nasa',
    execute(args, boxen, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, progressbar, result, translate, webp) {

        message.reply(' cargando imagen del día... ')
            .then(msg => {
                fetch('https://api.nasa.gov/planetary/apod?api_key=ezowSxroDnhKvjzojV9SXx7LmZ6P7OndGYLGXuE9')
                    .then(response => response.json())
                    .then(quote => {
                        translate(quote.explanation, { to: "es" }).then(res => {
                            var embed = new MessageEmbed();
                            embed.setTitle(quote.title);
                            embed.setDescription(":flag_es: **Traducción: **" + res.text);
                            embed.setImage(quote.hdurl);
                            embed.setColor('#dd361c');
                            embed.setFooter("Imagen por " + quote.copyright);
                            message.channel.send(embed);
                            msg.delete();
                        });
                    });
            })


    }
}