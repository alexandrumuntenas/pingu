module.exports = {
  name: 'id',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.misc.id
    message.channel.send(`<:win_information:876119543968305233> ${i18n} \`${message.guild.id}\``)
  }
}
