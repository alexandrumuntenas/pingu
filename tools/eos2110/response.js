const { Permissions } = require('discord.js')
const makeId = require('../../modules/makeId')
module.exports = {
  name: 'response',
  execute (args, client, con, contenido, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    i18n = i18n.tools.config.response
    message.channel.send(':warning: El comando `response` será removido en la actualización 2110, que será implementada el 01/09/2021. (EOS 2110, más info en nuestro servidor de soporte)')
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (args[1]) {
        switch (args[1]) {
          case 'create': {
            const identificador = makeId(7)
            message.channel.send(`:arrow_right: ${i18n.create.question_a}`)
            message.channel.awaitMessages(m => m.author.id === message.author.id,
              { max: 1 }).then(collected => {
              let accionante = collected.first().content
              accionante = accionante.toLowerCase()
              message.channel.send(`:arrow_right: ${i18n.create.question_b}`)
              message.channel.awaitMessages(m => m.author.id === message.author.id,
                { max: 1 }).then(collected => {
                const respuesta = collected.first().content
                const crearcres = "INSERT INTO `guildAutoResponder` (`identificador`,`guild`, `action`, `returns`) VALUES ('" + identificador + "','" + message.guild.id + "', '" + accionante + "', '" + respuesta + "')"
                con.query(crearcres, function (err) {
                  console.log(err)
                  message.channel.send(`<:pingu_check:876104161794596964> ${i18n.create.success}: \`${identificador}\``)
                })
              })
            })
            break
          }
          case 'remove': {
            const delcmd = "DELETE FROM `guildAutoResponder` WHERE `identificador` = '" + args[2] + "' AND `guild` = " + message.guild.id
            con.query(delcmd, function (err) {
              console.log(err)
              message.channel.send(`<:pingu_check:876104161794596964> ${i18n.remove.success}: \`${args[2]}\``)
            })
            break }
          default: {
            message.channel.send(`<:win_information:876119543968305233> ${i18n.invalid} :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/respuestas-personalizadas`)
            break }
        }
      } else {
        message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_args}: \`create\` \`remove\``)
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
