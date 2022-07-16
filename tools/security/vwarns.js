const { Permissions, MessageEmbed } = require('discord.js')
const getLocales = require('../../modules/getLocales')
const unixTime = require('unix-time')
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'vwarns',
  execute (args, client, con, locale, message, result) {
    if (result[0].moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        if (message.mentions.users.first()) {
          con.query('SELECT * FROM `guildWarns` WHERE user = ? AND guild = ? LIMIT 25', [message.mentions.users.first().id, message.guild.id], (err, result) => {
            if (err) console.log(err)
            const allwarnsEmbed = new MessageEmbed().setColor('#FFC107').setAuthor(getLocales(locale, 'WARN_EMBED_SUCCESS_TITLE', { USER: message.mentions.users.first().tag }), message.mentions.users.first().displayAvatarURL())
            if (result.length !== 0) {
              for (let i = 0; i < result.length; i++) {
                allwarnsEmbed.addField(`:stopwatch: <t:${unixTime(result[i].timestamp)}>`, getLocales(locale, 'VIEW_WARNS_EMBED_REASON', { ID: result[0].identificador, REASON: result[i].motivo.trim() }))
              }
            } else {
              allwarnsEmbed.setDescription(getLocales(locale, 'VIEW_WARNS_EMBED_NORESULTS'))
            }
            message.channel.send({ embeds: [allwarnsEmbed] })
          })
        } else {
          const allwarnsEmbed = new MessageEmbed().setColor('#FFC107').setAuthor(getLocales(locale, 'VIEW_WARNS_EMBED_TITLE', { USER: message.author.tag }), message.author.displayAvatarURL())
          con.query('SELECT * FROM `guildWarns` WHERE user = ? AND guild = ? LIMIT 25', [message.author.id, message.guild.id], (err, result) => {
            if (err) console.log(err)
            if (result.length !== 0) {
              for (let i = 0; i < result.length; i++) {
                allwarnsEmbed.addField(`:stopwatch: <t:${unixTime(result[i].timestamp)}>`, getLocales(locale, 'VIEW_WARNS_EMBED_REASON', { ID: result[0].identificador, REASON: result[i].motivo.trim() }))
              }
            } else {
              allwarnsEmbed.setDescription(getLocales(locale, 'VIEW_WARNS_EMBED_NORESULTS'))
            }
            message.channel.send({ embeds: [allwarnsEmbed] })
          })
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
