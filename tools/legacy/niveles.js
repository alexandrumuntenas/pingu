const emojiStrip = require('emoji-strip')
const { isInteger } = require('mathjs')

module.exports = {
  name: 'niveles',
  execute (args, client, con, contenido, message, result) {
    let lan = require(`../../languages/${result[0].guild_language}.json`)
    lan = lan.tools.config.niveles
    message.channel.send(':warning: El comando `niveles` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
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
        message.channel.send(`${lan.index.before} \n \n **${lan.index.avaliable}** \n **1.** ${lan.index.options.first} \n **2.** ${lan.index.options.second} \n **3.** ${lan.index.options.third} \n **4.** ${lan.index.options.fourth} \n **5.** ${lan.index.options.fifth} \n **6.** ${lan.index.options.sixth} \n **7.** ${lan.index.options.seventh}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1, time: 30000, errors: ['time'] }).then(collected => {
          switch (collected.first().content) {
            case '1':
              purga()
              toggleModule()
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
              updateBackground()
              break
            case '5':
              purga()
              updateDifficulty()
              break
            case '6':
              purga()
              message.channel.send('Configuración en desarrollo...')
              indice()
              break
            case '7':
              message.channel.send(`<:win_information:876119543968305233> ${lan.time_error}`)
              break
            default:
              purga()
              indice()
              break
          }
        }).catch((err) => {
          if (err) console.log(err)
          message.channel.send(`<:win_information:876119543968305233> ${lan.time_error}`)
        })
      }

      function toggleModule () {
        message.channel.send(`:arrow_right: ${lan.toggle_niveles.question} ${lan.toggle_niveles.avaliable_responses}: y(es) / n(o)`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().content === 'y' || collected.first().content === 'yes') {
            con.query('UPDATE `guild_data` SET `leveling_enabled` = 1 WHERE `guild` = ?', [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_niveles.response_a}`)
            indice()
          } else {
            con.query('UPDATE `guild_data` SET `leveling_enabled` = 0 WHERE `guild` = ?', [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_niveles.response_b}`)
            indice()
          }
        })
      }

      function updateMessage () {
        message.channel.send(`:arrow_right: ${lan.update_message.question} <:warn:858736919432527942> ${lan.update_message.success}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          con.query('UPDATE `guild_data` SET `leveling_rankup_message` = ? WHERE `guild_data`.`guild` = ?', [emojiStrip(collected.first().content), message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_message.success}`)
          indice()
        })
      }

      function updateChannel () {
        message.channel.send(`:arrow_right: ${lan.update_channel}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().mentions.channels.first()) {
            con.query('UPDATE `guild_data` SET `leveling_rankup_channel` = ? WHERE `guild_data`.`guild` = ?', [collected.first().mentions.channels.first().id, message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_channel.success}`)
            indice()
          } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.update_channel.invalid}`)
            updateChannel()
          }
        })
      }

      function updateBackground () {
        message.channel.send(`:arrow_right: ${lan.update_fondo.question}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (isInteger(collected.first().content)) {
            if (parseInt(collected.first().content) <= 20 && parseInt(collected.first().content) >= 1) {
              con.query('UPDATE `guild_data` SET `leveling_rankup_image_background` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id])
              message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_fondo.success}`)
              indice()
            } else {
              message.channel.send(`<:pingu_cross:876104109256769546> ´${lan.update_fondo.invalid}`)
              updateBackground()
            }
          } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.update_fondo.notinteger}`)
            updateBackground()
          }
        })
      }

      function updateDifficulty () {
        message.channel.send(`:arrow_right: ${lan.update_dificultad.question}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (isInteger(collected.first().content)) {
            if (parseInt(collected.first().content) < 5 && parseInt(collected.first().content) > 0) {
              con.query('UPDATE `guild_data` SET `leveling_rankup_difficulty` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id])
              message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_dificultad.success}`)
              indice()
            } else {
              message.channel.send(`<:win_information:876119543968305233> ${lan.update_dificultad.invalid}`)
              updateDifficulty()
            }
          } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.update_dificultad.notinteger}`)
            updateBackground()
          }
        })
      }

      message.channel.send(`<:win_information:876119543968305233> ${lan.startup}`)
      indice()
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
    }
  }
}
