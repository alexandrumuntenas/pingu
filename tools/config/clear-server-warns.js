module.exports = {
  name: 'clear-server-warns',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.security.clearserverwarns
    if (message.author.id === message.guild.ownerID) {
      con.query('DELETE FROM `guild_warns` WHERE guild = ?', [message.guild.id], function (err) {
        if (err) console.log(err)
        message.channel.send(`<:pingu_check:876104161794596964> ${lan.success}`)
      })
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
    }
  }
}
