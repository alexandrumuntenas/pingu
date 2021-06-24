module.exports = {
    name: 'all-infractions',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    var user = message.mentions.users.first()
                    async function step1() {
                        con.query('SELECT * FROM `infracciones` WHERE user = \'' + user.id + '\' AND guild = \'' + global.id + '\'', function (err, result) {
                            if (err) throw err;
                            var pdfDoc = new pdf;
                            pdfDoc.pipe(fs.createWriteStream('./usuarios/moderacion/' + user.id + '_' + global.id + '.pdf'));
                            pdfDoc.font('./recursos/typography/Roboto-Bold.ttf', 20).text('Servicios de Moderación · Wired Penguin').moveDown(1);
                            pdfDoc.font('./recursos/typography/Roboto-Regular.ttf', 12).text("Infracciones del usuario: " + user.tag);
                            pdfDoc.text("Servidor: " + global.name);
                            pdfDoc.text("Documento generado el: " + moment().format('MMMM Do YYYY, h:mm:ss a'));
                            var i = 0;
                            if (result.length != 0) {
                                for (var i = 0; i < result.length; i++) {
                                    pdfDoc.moveDown(1).font('./recursos/typography/Roboto-Regular.ttf').text('Infraccion #' + i).font('./recursos/typography/Roboto-Thin.ttf').text(result[i].motivo);
                                }
                            } else {
                                pdfDoc.moveDown(1).text('El usuario no dispone de infracciones');
                            }
                            pdfDoc.end();
                            pdfDoc.on('end', function (err) {
                                if (err) throw err;
                                var attachament = new MessageAttachment('./usuarios/moderacion/' + user.id + '_' + global.id + '.pdf');
                                message.author.send('Aquí está el reporte para el usuario `' + user.tag + '` en el servidor *' + global.name + '*', attachament);
                            })
                        });
                    }
                    async function cocina() {
                        await step1();

                    }
                    cocina();
                } else {
                    var user = message.author;
                    async function step1() {
                        con.query('SELECT * FROM `infracciones` WHERE user = \'' + user.id + '\' AND guild = \'' + global.id + '\'', function (err, result) {
                            if (err) throw err;
                            var pdfDoc = new pdf;
                            pdfDoc.pipe(fs.createWriteStream('./usuarios/moderacion/' + user.id + '_' + global.id + '.pdf'));
                            pdfDoc.font('./recursos/typography/Roboto-Bold.ttf', 20).text('Servicios de Moderación · Wired Penguin').moveDown(1);
                            pdfDoc.font('./recursos/typography/Roboto-Regular.ttf', 12).text("Infracciones del usuario: " + user.tag);
                            pdfDoc.text("Servidor: " + global.name);
                            pdfDoc.text("Documento generado el: " + moment().format('MMMM Do YYYY, h:mm:ss a'));
                            var i = 0;
                            if (result.length != 0) {
                                for (var i = 0; i < result.length; i++) {
                                    pdfDoc.moveDown(1).font('./recursos/typography/Roboto-Regular.ttf').text('Infraccion #' + i).font('./recursos/typography/Roboto-Thin.ttf').text(result[i].motivo);
                                }
                            } else {
                                pdfDoc.moveDown(1).text('El usuario no dispone de infracciones');
                            }
                            var attachament = new MessageAttachment('./usuarios/moderacion/' + user.id + '_' + global.id + '.pdf');
                            message.author.send('Aquí está el reporte para el usuario `' + user.tag + '` en el servidor *' + global.name + '*', attachament);
                            pdfDoc.end();
                        });
                    }
                    async function cocina() {
                        await step1();

                    }
                    cocina();
                }
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}