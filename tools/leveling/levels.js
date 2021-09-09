const { MessageEmbed } = require('discord.js')
const getLocales = require('../../modules/getLocales')
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'levels',
  execute (client, locale, message, result) {
    if (result[0].leveling_enabled !== 0) {
¡      client.pool.query('SELECT * FROM `guildLevels` WHERE guild = ? ORDER BY nivel DESC, experiencia DESC LIMIT 10', [message.guild.id], (err, rows, result) => {
        if (err) console.log(err)
        if (result) {
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const embed = new MessageEmbed()
              .setTitle(getLocales(locale, 'LEVELS_TITLE'))
              .setAuthor(message.guild.name)
              .setColor('#FFD700')
            rows.forEach(function (row) {
              const usuario = message.guild.members.cache.get(row.user)
              embed.addFields({ name: usuario.nickname || usuario.displayName || 'Lost User#0000', value: `${getLocales(locale, 'LEVELS_ENTRY', { LEVEL: row.nivel, XP: row.experiencia })}` })
            })
            message.channel.send({ embeds: [embed] })
          } else {
            genericMessages.Error.customerror(message, locale, 'LEVELS_NODATA')
          };
        }
      })
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
