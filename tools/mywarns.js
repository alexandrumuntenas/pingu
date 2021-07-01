module.exports = {
    name: 'mywarns',
    execute(args, canvacord, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (result[0].moderador_activado != 0) {
            const user = message.author;
            var verinfracciones5 = "SELECT * FROM `infracciones` WHERE `guild` = '" + global.id + "' AND `user` = '" + user.id + "' LIMIT 5";
            var verinfraccionescantidad = "SELECT COUNT(*) as total FROM `infracciones` WHERE `guild` = '" + global.id + "' AND `user` = '" + user.id + "'";

            con.query(verinfraccionescantidad, function (err, result) {
                var ultimas = result[0].total;
                con.query(verinfracciones5, function (err, result) {
                    var embed = new MessageEmbed().setAuthor("Infracciones de " + user.tag, user.displayAvatarURL()).setTitle('Infracciones totales').setDescription(ultimas);
                    async function infraccionestotales() {
                        var i = 0;
                        for (var i = 0; i < result.length; i++) {
                            var timeStamp = JSON.stringify(result[i].timestamp);
                            var s = timeStamp;
                            var m = moment(s, 'YYYY MM dd').format('MM-DD-YYYY');
                            embed.addFields({ name: 'Infracción #' + (i + 1), value: "**" + result[i].motivo + "** • " + s.slice(0, 11) + "\"" })
                        }
                        message.channel.send(embed);
                    }
                    infraccionestotales();
                })
            })
        }
    }
}