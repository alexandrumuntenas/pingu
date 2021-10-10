const { MessageEmbed } = require('discord.js')
const getLocales = require('../../modules/getLocales')
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'levels',
  execute (client, locale, message) {
    if (message.database.leveling_enabled !== 0) {
      client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC LIMIT 10', [message.guild.id], (err, rows, result) => {
        if (err) {
          client.Sentry.captureException(err)
          client.log.error(err)
        }
        if (result) {
          if (Object.prototype.hasOwnProperty.call(result, 0)) {
            const embed = new MessageEmbed()
              .setTitle(`:trophy: ${getLocales(locale, 'LEVELS_TITLE')}`)
              .setFooter(message.guild.name)
              .setColor('#FFD700')
            rows.forEach(function (row) {
              const usuario = message.guild.members.cache.get(row.member)
              embed.addFields({ name: usuario.nickname || usuario.displayName || 'Lost User#0000', value: `${getLocales(locale, 'LEVELS_ENTRY', { LEVEL: row.memberLevel, XP: row.memberExperience })}` })
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
