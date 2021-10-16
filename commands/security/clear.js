const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')

module.exports = {
  name: 'clear',
  execute (client, locale, message) {
    if (message.database.moderator_enabled !== 0) {
      if (message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.KICK_MEMBERS, Permissions.FLAGS.BAN_MEMBERS]) || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
        message.args[0] = parseInt(message.args[0].replace(/\D/g, ''))
        if (message.args[0] && parseInt(message.args[0]) <= 100) {
          if (message.mentions.users.first()) {
            message.delete()
            message.channel.messages.fetch().then((messages) => {
              const botMessages = []
              let i = 0
              messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => {
                if (i < message.args[0]) {
                  i++
                  botMessages.push(msg)
                }
              })
              message.channel.bulkDelete(botMessages, true).then((_message) => {
                const sent = new MessageEmbed().setColor('GREEN').setDescription(`:broom: ${getLocales(locale, 'CLEAR_EMBED_TITLE', { BROOM: _message.size })}`)
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
            message.channel.bulkDelete(message.args[0], true)
              .then((_message) => {
                const sent = new MessageEmbed().setColor('GREEN').setDescription(`:broom: ${getLocales(locale, 'CLEAR_EMBED_TITLE', { BROOM: _message.size })}`)
                message.channel
                  .send({ embeds: [sent] }).then((sent) => {
                    setTimeout(() => {
                      sent.delete()
                    }, 2500)
                  })
              })
          }
        } else {
          genericMessages.Info.help(message, locale, `${message.database.guildPrefix}clear <number <= 100> (@user)`)
        }
      } else {
        genericMessages.Error.permerror(message, locale)
      }
    } else {
      genericMessages.Error.no_avaliable(message, locale)
    }
  }
}
