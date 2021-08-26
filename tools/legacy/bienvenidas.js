const { isInteger } = require('mathjs')
const emojiStrip = require('emoji-strip')

module.exports = {
  name: 'bienvenidas',
  execute (args, client, con, contenido, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    i18n = i18n.tools.config.bienvenidas
    message.channel.send(':warning: El comando `bienvenidas` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
    if (message.guild.ownerID === message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
      let ftime = 0
      function purga () {
        if (ftime === 0) {
          ++ftime
        } else {
          message.channel.bulkDelete(2)
        }
      }

      const rolesUserSet = new Set()
      const usersss = result[0].welcome_roles
      if (usersss) {
        const roleUser = usersss.split(',')
        roleUser.forEach(element => {
          rolesUserSet.add(element)
        })
      }

      function indice () {
        message.channel.send(`${i18n.index.before} \n \n **${i18n.index.avaliable}** \n **1.** ${i18n.index.options.first}\n **2.** ${i18n.index.options.second}\n **3.** ${i18n.index.options.third} \n **4.** ${i18n.index.options.fourth} \n **5.** ${i18n.index.options.fifth} \n **6.** ${i18n.index.options.sixth} \n **7.** ${i18n.index.options.seventh}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1, time: 30000, errors: ['time'] }).then(collected => {
          switch (collected.first().content) {
            case '1':
              purga()
              toggleMessage()
              break
            case '2':
              purga()
              updateMessage()
              break
            case '3':
              purga()
              updateChannel()
              break
            case '4':
              purga()
              toggleCartel()
              break
            case '5':
              purga()
              updateBackground()
              break
            case '6':
              purga()
              userGiveRole()
              break
            case '7':
              message.channel.send(`<:win_information:876119543968305233> ${i18n.index.time_error}`)
              break
            default:
              purga()
              indice()
              break
          }
        }).catch(collected => {
          message.channel.send(`<:win_information:876119543968305233> ${i18n.index.time_error}`)
        })
      }

      function toggleMessage () {
        message.channel.send(`:arrow_right: ${i18n.toggle_message.question} ${i18n.toggle_message.avaliable_responses}: y(es) / n(o)`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().content === 'y' || collected.first().content === 'yes') {
            con.query("UPDATE `guild_data` SET `welcome_enabled` = '1' WHERE `guild_data`.`guild` = ?", [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_message.response_b}`)
            indice()
          } else {
            con.query("UPDATE `guild_data` SET `welcome_enabled` = '0' WHERE `guild_data`.`guild` = ?", [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_message.response_a}`)
            indice()
          }
        })
      }

      function toggleCartel () {
        message.channel.send(`:arrow_right: ${i18n.toggle_cartel.question} ${i18n.toggle_cartel.avaliable_responses}: y(es) / n(o)`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().content === 'y' || collected.first().content === 'yes') {
            con.query("UPDATE `guild_data` SET `welcome_image` = '1' WHERE `guild_data`.`guild` = ?" + [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_cartel.response_b}`)
            indice()
          } else {
            con.query("UPDATE `guild_data` SET `welcome_image` = '0' WHERE `guild_data`.`guild` = ?", [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_cartel.response_a}`)
            indice()
          }
        })
      }
      function addRolUsers () {
        message.channel.send(`:arrow_right: ${i18n.dar_rol.add_rol.question}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().mentions.roles.first()) {
            collected.first().mentions.roles.array().forEach(
              element => {
                rolesUserSet.add(element.id)
              }
            )
            purga()
            userGiveRole()
          } else {
            message.channel.send(`<:win_information:876119543968305233> ${i18n.dar_rol.add_rol.invalid_message}`)
            addRolUsers()
          }
        })
      }
      function delRolUsers () {
        message.channel.send(`:arrow_right: ${i18n.dar_rol.del_rol.question}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().mentions.roles.first()) {
            collected.first().mentions.roles.array().forEach(
              element => {
                rolesUserSet.delete(element.id)
              }
            )
            purga()
            userGiveRole()
          } else {
            message.channel.send(`<:win_information:876119543968305233> ${i18n.dar_rol.del_rol.invalid_message}`)
            delRolUsers()
          }
        })
      }
      function saveRolUsers () {
        con.query('UPDATE `guild_data` SET `welcome_roles` = ? WHERE `guild_data`.`guild` = ?' + message.guild.id, [Array.from(rolesUserSet), message.guild.id])
        userGiveRole()
      }
      function userGiveRole () {
        let rolset = ''
        rolesUserSet.forEach(element => {
          rolset = rolset + '<@&' + element + '> '
        })
        message.channel.send(`${i18n.dar_rol.give_role.showcase}\n${rolset}`)
        message.channel.send(`${i18n.dar_rol.give_role.before} \n \n **${i18n.dar_rol.give_role.avaliable}** \n **1.** ${i18n.dar_rol.give_role.options.first}\n **2.** ${i18n.dar_rol.give_role.options.second}\n **3.** ${i18n.dar_rol.give_role.options.third} \n **4.** ${i18n.dar_rol.give_role.options.fourth}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          switch (collected.first().content) {
            case '1':
              purga()
              addRolUsers()
              break
            case '2':
              purga()
              delRolUsers()
              break
            case '3':
              purga()
              saveRolUsers()
              break
            default:
              purga()
              indice()
              break
          }
        })
      }

      function updateChannel () {
        message.channel.send(`:arrow_right: ${i18n.update_channel.question}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().mentions.channels.first()) {
            con.query('UPDATE `guild_data` SET `welcome_channel` = ? WHERE `guild_data`.`guild` = ?' + message.guild.id, [collected.first().mentions.channels.first().id, message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.update_channel.response}`)
            indice()
          } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.update_channel.response}`)
            updateChannel()
          }
        })
      }

      function updateMessage () {
        message.channel.send(`:arrow_right: ${i18n.update_message.question} <:warn:858736919432527942> ${i18n.update_message.emoji_remover}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          con.query('UPDATE `guild_data` SET `welcome_message` = ? WHERE `guild_data`.`guild` = ?', [emojiStrip(collected.first().content), message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.update_message.response}`)
          indice()
        })
      }

      function updateBackground () {
        message.channel.send(':arrow_right: https://pingu.duoestudios.es/personalizacion/fondos. <:warn:858736919432527942> No debe incluír el `#`')
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (isInteger(collected.first().content)) {
            if (parseInt(collected.first().content) <= 20 || parseInt(collected.first().content) >= 1) {
              con.query('UPDATE `guild_data` SET `bienvenida_fondo` = ? WHERE `guild_data`.`guild` = ?' + message.guild.id, [collected.first().content, message.guild.id])
              message.channel.send('<:pingu_check:876104161794596964> Se ha actualizado el fondo de los carteles de bienvenida')
              indice()
            } else {
              message.channel.send('<:pingu_cross:876104109256769546> Ese fondo no existe, por favor, introduzca un ID válido.')
              updateBackground()
            }
          } else {
            message.channel.send('<:pingu_cross:876104109256769546> El valor introducido debe ser alfanumérico.')
            updateBackground()
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
