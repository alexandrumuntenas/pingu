const makeId = require('../../gen/makeId')

module.exports = {
  name: 'config',
  execute (args, client, con, contenido, message, result) {
    let lan = require(`../../languages/${result[0].guild_language}.json`)
    lan = lan.tools.config
    const claveiande = makeId(25)
    const claveadmin = makeId(12)
    if (message.guild.ownerID === message.author.id) {
      con.query('DELETE FROM `apolo_sessions` WHERE `Guild_ID` LIKE ' + message.guild.id)
      con.query("INSERT INTO `apolo_sessions` (`Clave_de_Acceso`,`Guild_ID`,`Solicitante_ID`, `Clave_de_Autorizacion`) VALUES ('" + claveiande + "','" + message.guild.id + "', '" + message.author.id + "', '" + claveadmin + "')")
      message.author.send(`:tools: **Pingu · ${lan.configPanel}**\n${lan.configToken}: \`${claveiande}\`\n${lan.configAdmin}: \`${claveadmin}\`\n${lan.configUrl}: https://pingu.duoestudios.com/login/?iande=${claveiande}&auth=${claveadmin}\n${lan.configInstructions}`)
      setTimeout(() => {
        con.query("DELETE FROM `apolo_sessions` WHERE Clave_de_Acceso = '" + claveiande + "'")
      }, 3600000)
      message.delete()
    } else {
      if (message.member.hasPermission('ADMINISTRATOR')) {
        con.query('DELETE FROM `apolo_sessions` WHERE `Guild_ID` LIKE ' + message.guild.id)
        con.query("INSERT INTO `apolo_sessions` (`Clave_de_Acceso`,`Guild_ID`,`Solicitante_ID`, `Clave_de_Autorizacion`) VALUES ('" + claveiande + "','" + message.guild.id + "', '" + message.author.id + "', '" + claveadmin + "')")
        message.author.send(`:tools: **Pingu · ${lan.configPanel}**\n${lan.configToken}: \`${claveiande}\`\n${lan.configUrl}: https://pingu.duoestudios.com/login/?iande=${claveiande}\n${lan.configInstructions}`)
        client.users.cache.get(message.guild.ownerID).send(`:tools: **Pingu · ${lan.configPanel}**\n*${message.author.tag}* ${lan.configAdminInstructions}: \`${claveadmin}\``)
        setTimeout(() => {
          con.query("DELETE FROM `apolo_sessions` WHERE Clave_de_Acceso = '" + claveiande + "'")
        }, 3600000)
        message.delete()
      } else {
        message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
      }
    }
  }
}
