const { MessageAttachment } = require('discord.js')
const moment = require('moment')
const Pdf = require('pdfkit')
const fs = require('fs')

module.exports = {
  name: 'all-warns',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.allwarns
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          async function step1 () {
            con.query('SELECT * FROM `guildWarns` WHERE user = ? AND guild = ?', [message.mentions.users.first().id, message.guild.id], (err, result) => {
              if (err) console.log(err)
              const pdfDoc = new Pdf()
              pdfDoc.pipe(fs.createWriteStream('./usuarios/moderacion/' + message.mentions.users.first().id + '_' + message.guild.id + '.pdf'))
              pdfDoc.font('./recursos/typography/Roboto-Bold.ttf', 20).text(`${i18n.pdf.header} · Pingu`).moveDown(1)
              pdfDoc.font('./recursos/typography/Roboto-Regular.ttf', 12).text(`${i18n.pdf.user}: ${message.mentions.users.first().tag}`)
              pdfDoc.text(`${i18n.pdf.server}: ${message.guild.name}`)
              pdfDoc.text(`${i18n.pdf.gen_date}: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`)
              if (result.length !== 0) {
                for (let i = 0; i < result.length; i++) {
                  pdfDoc.moveDown(1).font('./recursos/typography/Roboto-Regular.ttf').text('Advertencia #' + i).font('./recursos/typography/Roboto-Thin.ttf').text(result[i].motivo)
                }
              } else {
                pdfDoc.moveDown(1).text(i18n.pdf.no_infractions)
              }
              pdfDoc.end()
              pdfDoc.on('end', function (err) {
                if (err) console.log(err)
                const attachament = new MessageAttachment('./usuarios/moderacion/' + message.mentions.users.first().id + '_' + message.guild.id + '.pdf')
                message.author.send(`**${i18n.dm.header}**\n ${i18n.dm.user}: ${message.mentions.users.first().tag}\n ${i18n.dm.server}: ${message.guild.name} \n ${i18n.dm.gen_date} ${moment().format('MMMM Do YYYY, h: mm: ss a')}`, attachament)
              })
            })
          }
          async function cocina () {
            await step1()
          }
          cocina()
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_param}`)
        }
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
