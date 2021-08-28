module.exports = {
  name: 'clear-server-warns',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.clearserverwarns
    if (message.author.id === message.guild.ownerID) {
      con.query('DELETE FROM `guildWarns` WHERE guild = ?', [message.guild.id], function (err) {
        if (err) console.log(err)
        message.channel.send(`<:pingu_check:876104161794596964> ${i18n.success}`)
      })
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
