module.exports = {
    name: 'chiste',
    execute(args, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {

        message.reply(' cargando chiste...')
            .then(msg => {
                fetch('https://official-joke-api.appspot.com/jokes/random')
                    .then(response => response.json())
                    .then(quote => {
                        translate(quote.setup, { to: "es" }).then(res => {
                            var inicip = res.text;
                            translate(quote.punchline, { to: "es" }).then(res => {
                                var embed = new MessageEmbed();
                                embed.setDescription(inicip);
                                embed.setColor('#F7CB46');
                                embed.setFooter(res.text);
                                message.channel.send(embed);
                                msg.delete();
                            });
                        });
                    });
            })


    }
}