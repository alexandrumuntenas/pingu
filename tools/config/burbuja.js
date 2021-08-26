module.exports = {
  name: 'burbuja',
  execute (args, client, con, contenido, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    i18n = i18n.tools.config.burbuja
    if (message.guild.ownerID === message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
      const valor = result[0].burbuja_activado
      if (valor === 1) {
        con.query("UPDATE `guild_data` SET `burbuja_activado` = '0' WHERE `guild_data`.`guild` = ?", [message.guild.id])
        message.channel.send(`<:pingu_check:876104161794596964> ${i18n.response_a}`)
      } else {
        con.query("UPDATE `guild_data` SET `burbuja_activado` = '1' WHERE `guild_data`.`guild` = ?", [message.guild.id])
        message.channel.send(`<:pingu_check:876104161794596964> ${i18n.response_b}`)
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
