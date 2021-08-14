const { MessageAttachment } = require('discord.js');
const moment = require('moment');
const pdf = require('pdfkit');
const fs = require('fs')

module.exports = {
    name: 'all-warns',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.security.allwarns;
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                if (message.mentions.users.first()) {
                    var user = message.mentions.users.first()
                    async function step1() {
                        con.query('SELECT * FROM `guild_warns` WHERE user = \'' + user.id + '\' AND guild = \'' + message.guild.id + '\'', function (err, result) {
                            if (err) console.log(err)
                            var pdfDoc = new pdf;
                            pdfDoc.pipe(fs.createWriteStream('./usuarios/moderacion/' + user.id + '_' + message.guild.id + '.pdf'));
                            pdfDoc.font('./recursos/typography/Roboto-Bold.ttf', 20).text(`${lan.pdf.header} · Pingu`).moveDown(1);
                            pdfDoc.font('./recursos/typography/Roboto-Regular.ttf', 12).text(`${lan.pdf.user}: ${user.tag}`);
                            pdfDoc.text(`${lan.pdf.server}: ${message.guild.name}`);
                            pdfDoc.text(`${lan.pdf.gen_date}: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`);
                            var i = 0;
                            if (result.length != 0) {
                                for (var i = 0; i < result.length; i++) {
                                    pdfDoc.moveDown(1).font('./recursos/typography/Roboto-Regular.ttf').text('Advertencia #' + i).font('./recursos/typography/Roboto-Thin.ttf').text(result[i].motivo);
                                }
                            } else {
                                pdfDoc.moveDown(1).text(lan.pdf.no_infractions);
                            }
                            pdfDoc.end();
                            pdfDoc.on('end', function (err) {
                                if (err) console.log(err)
                                var attachament = new MessageAttachment('./usuarios/moderacion/' + user.id + '_' + message.guild.id + '.pdf');
                                message.author.send(`**${lan.dm.header}**\n ${lan.dm.user}: ${user.tag}\n ${lan.dm.server}: ${message.guild.name} \n ${lan.dm.gen_date} ${moment().format('MMMM Do YYYY, h: mm: ss a')}`, attachament);
                            })
                        });
                    }
                    async function cocina() {
                        await step1();

                    }
                    cocina();
                } else {
                    message.channel.send(`<:win_information:876119543968305233> ${lan.missing_param}`);
                }
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}