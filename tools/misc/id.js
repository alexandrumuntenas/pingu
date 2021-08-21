module.exports = {
  name: 'id',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.misc.id
    message.channel.send(`<:win_information:876119543968305233> ${lan} \`${message.guild.id}\``)
  }
}
