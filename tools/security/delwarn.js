module.exports = {
  name: 'delwarn',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.security.delwarn
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          if (args[2]) {
            con.query('SELECT * FROM guild_warns WHERE guild = ? AND user = ? AND identificador = ?', [message.guild.id, message.mentions.users.first().id, args[2]], (err, result) => {
              if (err) console.log(err)
              if (Object.prototype.hasOwnProperty.call(result, 0)) {
                con.query('DELETE FROM guild_warns WHERE guild = ? AND user = ? AND identificador = ?', [message.guild.id, message.mentions.users.first().id, args[2]])
                message.channel.send(`<:pingu_check:876104161794596964> ${lan.success} (\`${args[2]}\`)`)
              } else {
                message.channel.send(`<:win_information:876119543968305233> \`${message.mentions.users.first().tag}\` ${lan.userNoHasWarn} \`${args[2]}\``)
              }
            })
          } else {
            message.channel.send(`<:win_information:876119543968305233> ${lan.missing_args}: \`${result[0].guild_prefix}delwarn <${lan.usage.param1}> <${lan.usage.param2}>\``)
          }
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${lan.missing_args}: \`${result[0].guild_prefix}delwarn <${lan.usage.param1}> <${lan.usage.param2}>\``)
        }
      } else {
        message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
      }
    }
  }
}
