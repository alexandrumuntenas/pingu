const { isInteger } = require('mathjs')

module.exports = {
  name: 'moderador',
  execute (args, client, con, contenido, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    i18n = i18n.tools.config.moderador
    message.channel.send(':warning: El comando `moderador` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
    if (message.guild.ownerID === message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
      let ftime = 0
      function purga () {
        if (ftime === 0) {
          ++ftime
        } else {
          message.channel.bulkDelete(2)
        }
      }
      function indice () {
        message.channel.send(`${i18n.index.before} \n \n **${i18n.index.avaliable}** \n **1.** ${i18n.index.options.first} \n **2.** ${i18n.index.options.second} \n **3.** ${i18n.index.options.third}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1, time: 30000, errors: ['time'] }).then(collected => {
          switch (collected.first().content) {
            case '1':
              purga()
              toggleModule()
              break
            case '2':
              purga()
              menuModwarn()
              break
            case '3':
              message.channel.send(`<:win_information:876119543968305233> ${i18n.time_error}`)
              break
            default:
              purga()
              indice()
              break
          }
        }).catch(collected => {
          message.channel.send(`<:win_information:876119543968305233> ${i18n.time_error}`)
        })
      }

      function toggleModule () {
        const valor = result[0].moderator_enabled
        if (valor === 1) {
          con.query('UPDATE `guildData` SET `moderator_enabled` = 0 WHERE `guild` = ?', [message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_moderator.response_a}`)
          result[0].moderator_enabled = 0
        } else {
          con.query('UPDATE `guildData` SET `moderator_enabled` = 0 WHERE `guild` = ?', [message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_moderator.response_b}`)
          result[0].moderator_enabled = 1
        }

        indice()
      }

      function toggleModWarn () {
        const valor = result[0].moderador_warn_expulsion_activado
        if (valor === 1) {
          con.query('UPDATE `guildData` SET `moderator_war_expulsion_activado` = 0 WHERE `guild` = ?', [message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_modwarn.response_a}`)
          result[0].moderador_warn_expulsion_activado = 0
        } else {
          con.query('UPDATE `guildData` SET `moderator_war_expulsion_activado` = 1 WHERE `guild` = ?', [message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_modwarn.response_b}`)
          result[0].moderador_warn_expulsion_activado = 1
        }
        menuModwarn()
      }

      function editLimit () {
        message.channel.send(`:arrow_right: ${i18n.e_limite.question}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (isInteger(parseInt(collected.first().content))) {
            const cantidad = parseInt(collected.first().content)
            const sql = "UPDATE `guildData` SET `moderador_warn_expulsion_cantidad` = '" + cantidad + "' WHERE `guildData`.`guild` = " + message.guild.id
            con.query(sql)
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.e_limite.success}`)
            menuModwarn()
          } else {
            message.channel.send(`<:win_information:876119543968305233>  ${i18n.e_limite.notinteger}`)
            editLimit()
          }
        })
      }

      function changeAction () {
        const valor = result[0].moderador_warn_expulsion_accion
        if (valor === 1) {
          con.query('UPDATE `guildData` SET `moderador_war_expulsion_accion` = 0 WHERE `guild` = ?', [message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_medida.response_a}`)
          result[0].moderador_warn_expulsion_accion = 0
        } else {
          con.query('UPDATE `guildData` SET `moderador_war_expulsion_accion` = 1 WHERE `guild` = ?', [message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_medida.response_b}`)
          result[0].moderador_warn_expulsion_accion = 1
        }
        menuModwarn()
      }
      function menuModwarn () {
        message.channel.send(`${i18n.e_modwarn.before} \n \n **${i18n.e_modwarn.avaliable}** \n **1.** ${i18n.e_modwarn.options.first} \n **2.** ${i18n.e_modwarn.options.second} \n **3.** ${i18n.e_modwarn.options.third} \n **4.** ${i18n.e_modwarn.options.fourth}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          switch (collected.first().content) {
            case '1':
              purga()
              toggleModWarn()
              break
            case '2':
              purga()
              changeAction()
              break
            case '3':
              purga()
              editLimit()
              break
            case '4':
              indice()
              break
            default:
              purga()
              menuModwarn()
              break
          }
        })
      }
      message.channel.send(`<:win_information:876119543968305233> ${i18n.startup}`)
      indice()
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
