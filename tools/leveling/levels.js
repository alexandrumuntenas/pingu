const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'levels',
  execute (args, client, con, locale, message, result) {
    let i18n = require(`../../i18n/${result[0].guild_language}.json`)
    const noavaliable = i18n.tools.noavaliable
    i18n = i18n.tools.leveling.levels
    if (result[0].leveling_enabled !== 0) {
      const dif = result[0].leveling_rankup_difficulty
      con.query('SELECT * FROM `guildLevels` WHERE guild = ? ORDER BY nivel DESC, experiencia DESC LIMIT 10', [message.guild.id], (err, rows, result) => {
        if (err) console.log(err)
        if (result) {
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const embed = new MessageEmbed()
              .setTitle(i18n.ranking)
              .setAuthor(message.guild.name)
              .setColor('#FFD700')
            rows.forEach(function (row) {
              const usuario = message.guild.members.cache.get(row.user)
              const nivel = parseInt(row.nivel)
              const experiencia = parseInt(row.experiencia)
              embed.addFields({ name: usuario.nickname || usuario.displayName || 'Lost User#0000', value: `${i18n.level}: ${row.nivel} | ${i18n.xp}: ${(((((nivel - 1) * (nivel - 1)) * dif) * 100) + experiencia)}` })
            })
            message.channel.send({ embeds: [embed] })
          } else {
            message.channel.send(`<:win_information:876119543968305233> ${i18n.nodata}`)
          };
        }
      })
    } else {
      message.channel.send(`<:pingu_cross:876104109256769546> ${noavaliable}`)
    }
  }
}
