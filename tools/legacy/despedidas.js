const emojiStrip = require('emoji-strip')

module.exports = {
  name: 'despedidas',
  execute (args, client, con, contenido, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    i18n = i18n.tools.config.despedidas
    message.channel.send(':warning: El comando `despedidas` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
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
        message.channel.send(` ${i18n.index.before} \n \n **${i18n.index.avaliable}** \n **1.** ${i18n.index.options.first} \n **2.** ${i18n.index.options.second}  \n **3.** ${i18n.index.options.third} \n **4.** ${i18n.index.options.fourth}`)
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

      function toggleMessage () {
        message.channel.send(`:arrow_right: ${i18n.toggle_message.question} ${i18n.toggle_message.avaliable_responses}: y(es) / n(o)`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().content === 'y' || collected.first().content === 'yes') {
            con.query('UPDATE `guild_data` SET `farewell_enabled` = \'1\' WHERE `guild_data`.`guild` = ?', [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_message.response_b}`)
            indice()
          } else {
            con.query('UPDATE `guild_data` SET `farewell_enabled` = \'0\' WHERE `guild_data`.`guild` = ?', [message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.toggle_message.response_a}`)
            indice()
          }
        })
      }

      function updateChannel () {
        message.channel.send(`:arrow_right: ${i18n.update_channel.question}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          if (collected.first().mentions.channels.first()) {
            con.query('UPDATE `guild_data` SET `farewell_channel` = ? WHERE `guild_data`.`guild` = ?', [collected.first().mentions.channels.first().id, message.guild.id])
            message.channel.send(`<:pingu_check:876104161794596964> ${i18n.update_channel.success}`)
            indice()
          } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.update_channel.invalid}`)
            updateChannel()
          }
        })
      }

      function updateMessage () {
        message.channel.send(`:arrow_right: ${i18n.update_message.question} <:warn:858736919432527942> ${i18n.update_message.emoji_remover}`)
        message.channel.awaitMessages(m => m.author.id === message.author.id,
          { max: 1 }).then(collected => {
          con.query('UPDATE `guild_data` SET `welcome_message` = ? WHERE `guild_data`.`guild` = ?', [emojiStrip(collected.first().content), message.guild.id])
          message.channel.send(`<:pingu_check:876104161794596964> ${i18n.update_message.success}`)
          indice()
        })
      }

      message.channel.send(`<:win_information:876119543968305233> ${i18n.startup}`)
      indice()
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
