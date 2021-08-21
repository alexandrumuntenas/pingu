const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'vwarns',
  execute (con, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.security.vwarns
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          const user = message.mentions.users.first()
          const verinfracciones5 = "SELECT * FROM `guild_warns` WHERE `guild` = '" + message.guild.id + "' AND `user` = '" + user.id + "' ORDER BY timestamp DESC LIMIT 25"
          const verinfraccionescantidad = "SELECT COUNT(*) as total FROM `guild_warns` WHERE `guild` = '" + message.guild.id + "' AND `user` = '" + user.id + "'"

          con.query(verinfraccionescantidad, (err, result) => {
            if (err) console.log(err)
            const ultimas = result[0].total
            con.query(verinfracciones5, (err, result) => {
              if (err) console.log(err)
              const embed = new MessageEmbed().setAuthor(user.tag, user.displayAvatarURL()).setTitle(lan.title).setDescription('Advertencias totales: ' + ultimas)
              async function infraccionestotales () {
                for (let i = 0; i < result.length; i++) {
                  const timeStamp = JSON.stringify(result[i].timestamp)
                  const s = timeStamp
                  embed.addFields({ name: `${lan.warning} (${result[i].identificador})`, value: '**' + result[i].motivo + '** • ' + s.slice(0, 11) + '"' }).setTimestamp()
                }
                message.channel.send(embed)
              }
              infraccionestotales()
            })
          })
        } else {
          message.channel.send(`<:win_information:876119543968305233> ${lan.newdmpromotion}`)
        }
      }
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
    }
  }
}
