const { MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'vwarns',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.vwarns
    if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          const user = message.mentions.users.first()
          con.query('SELECT COUNT(*) as total FROM `guildWarns` WHERE `guild` = ? AND `user` = ?', [message.guild.id, user.id], (err, result) => {
            if (err) console.log(err)
            const ultimas = result[0].total
            con.query('SELECT * FROM `guildWarns` WHERE `guild` = ? AND `user` = ? ORDER BY timestamp DESC LIMIT 25', [message.guild.id, user.id], (err, result) => {
              if (err) console.log(err)
              const embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL()).setTitle(i18n.title).setDescription('Advertencias totales: ' + ultimas)
              async function infraccionestotales () {
                for (let i = 0; i < result.length; i++) {
                  const timeStamp = JSON.stringify(result[i].timestamp)
                  const s = timeStamp
                  embed.addFields({ name: `${i18n.warning} (${result[i].identificador})`, value: '**' + result[i].motivo + '** • ' + s.slice(0, 11) + '"' }).setTimestamp()
                }
                message.channel.send({ embeds: [embed] })
              }
              infraccionestotales()
            })
          })
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${i18n.newdmpromotion}`)
        }
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
  }
}
