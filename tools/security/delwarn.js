const { Permissions } = require('discord.js')

module.exports = {
  name: 'delwarn',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.delwarn
    if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          if (args[2]) {
            con.query('SELECT * FROM guildWarns WHERE guild = ? AND user = ? AND identificador = ?', [message.guild.id, message.mentions.users.first().id, args[2]], (err, result) => {
              if (err) console.log(err)
              if (Object.prototype.hasOwnProperty.call(result, 0)) {
                con.query('DELETE FROM guildWarns WHERE guild = ? AND user = ? AND identificador = ?', [message.guild.id, message.mentions.users.first().id, args[2]])
                message.channel.send(`<:pingu_check:876104161794596964> ${i18n.success} (\`${args[2]}\`)`)
              } else {
                message.channel.send(`<:win_information:876119543968305233> \`${message.mentions.users.first().tag}\` ${i18n.userNoHasWarn} \`${args[2]}\``)
              }
            })
          } else {
            message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_args}: \`${result[0].guild_prefix}delwarn <${i18n.usage.param1}> <${i18n.usage.param2}>\``)
          }
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_args}: \`${result[0].guild_prefix}delwarn <${i18n.usage.param1}> <${i18n.usage.param2}>\``)
        }
      } else {
        message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
      }
    }
  }
}
