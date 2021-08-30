const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'clear',
  execute (args, client, con, locale, message, result) {
    if (result[0].moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        args[0] = parseInt(args[0].replace(/\D/g, ''))
        if (args[0] && parseInt(args[0]) <= 100) {
          if (message.mentions.users.first()) {
            message.delete()
            message.channel.messages.fetch().then((messages) => {
              const botMessages = []
              let i = 0
              messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => {
                if (i < args[0]) {
                  i++
                  botMessages.push(msg)
                }
              })
              message.channel.bulkDelete(botMessages, true).then((_message) => {
                const sent = new MessageEmbed().setColor('#28A745').setDescription(`:broom: ${getLocales(locale, 'CLEAR_EMBED_TITLE', { BROOM: _message.size })}`)
                message.channel
                  .send({ embeds: [sent] }).then((sent) => {
                    setTimeout(() => {
                      sent.delete()
                    }, 2500)
                  })
              })
            })
          } else {
            message.delete()
            message.channel.bulkDelete(args[0], true)
              .then((_message) => {
                const sent = new MessageEmbed().setColor('#28A745').setDescription(`:broom: ${getLocales(locale, 'CLEAR_EMBED_TITLE', { BROOM: _message.size })}`)
                message.channel
                  .send({ embeds: [sent] }).then((sent) => {
                    setTimeout(() => {
                      sent.delete()
                    }, 2500)
                  })
              })
          }
        } else {
          genericMessages.Info.help(message, locale, `${result[0].guild_prefix}clear <number <= 100> (@user)`)
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
