const { MessageAttachment } = require('discord.js');
const moment = require('moment');
const pdf = require('pdfkit');
const fs = require('fs')

module.exports = {
    name: 'all-infractions',
    execute(args, client, con, contenido, global, message, result) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    var user = message.mentions.users.first()
                    async function step1() {
                        con.query('SELECT * FROM `infracciones` WHERE user = \'' + user.id + '\' AND guild = \'' + global.id + '\'', function (err, result) {
                            if (err) console.log(err)
                            var pdfDoc = new pdf;
                            pdfDoc.pipe(fs.createWriteStream('./usuarios/moderacion/' + user.id + '_' + global.id + '.pdf'));
                            pdfDoc.font('./recursos/typography/Roboto-Bold.ttf', 20).text('Servicios de Moderación · Pingu ').moveDown(1);
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
                                if (err) console.log(err)
                                var attachament = new MessageAttachment('./usuarios/moderacion/' + user.id + '_' + global.id + '.pdf');
                                message.author.send('**Reporte de advertencias**\n Usuario: `' + user.tag + '`\n Servidor: `' + global.name + '` \n Fecha de Generación: `' + moment().format('MMMM Do YYYY, h:mm:ss a') + '`', attachament);
                            })
                        });
                    }
                    async function cocina() {
                        await step1();

                    }
                    cocina();
                } else {
                    message.channel.send(':information_source: Debe mencionar un usuario para poder realizar el reporte de advertencias. Uso: `' + global.prefix + 'all-infractions <@usuario>`');
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}