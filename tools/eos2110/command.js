module.exports = {
  name: 'command',
  execute (args, client, con, contenido, message, result) {
    let lan = require(`../../languages/${result[0].guild_language}.json`)
    lan = lan.tools.config.command
    message.channel.send(':warning: El comando `command` será removido en la actualización 2110, que será implementada el 01/09/2021. (EOS 2110, más info en nuestro servidor de soporte)')
    if (message.guild.ownerID === message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
      if (args[1]) {
        switch (args[1]) {
          case 'create':
            con.query('INSERT INTO `guild_commands` (`guild`, `cmd`, `returns`) VALUES (?,?,?)', [message.guild.id, args[2], message.content.replace(`${result[0].guild_prefix}command create ${args[2]}`, '')], function (err) {
              console.log(err)
              message.channel.send(`<:pingu_check:876104161794596964> ${lan.create.before}\`${args[2]}\`. ${lan.create.after} \`${message.content.replace(`${result[0].guild_prefix}command create ${args[2]}`, '')}\``)
            })
            break
          case 'remove':
            con.query('DELETE FROM `guild_commands` WHERE `guild` = ? AND `cmd` = ?', [message.guild.id, args[2]], function (err) {
              console.log(err)
              message.channel.send(`<:pingu_check:876104161794596964> ${lan.remove}: \`${args[2]}\``)
            })
            break
          default:
            message.channel.send(`<:win_information:876119543968305233> ${lan.invalid} :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/comandos-personalizados`)
            break
        }
      } else {
        message.channel.send(`<:win_information:876119543968305233> ${lan.missing_args}: \`create\` \`remove\``)
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
    }
  }
}
