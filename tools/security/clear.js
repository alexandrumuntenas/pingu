module.exports = {
  name: 'clear',
  execute (args, client, con, contenido, message, result) {
    const lan = require(`../../languages/${result[0].guild_language}.json`).tools.security.clear
    if (message.member.hasPermission(['MANAGE_MESSAGES', 'KICK_MEMBERS', 'BAN_MEMBERS']) || message.member.hasPermission('ADMINISTRATOR')) {
      if (result[0].moderator_enabled !== 0) {
        if (message.mentions.users.first()) {
          message.channel.messages.fetch({
            limit: args[1]
          }).then((messages) => {
            const botMessages = []
            message.channel.bulkDelete(1, true)
            messages.filter(m => m.author.id === message.mentions.users.first().id).forEach(msg => botMessages.push(msg))
            message.channel.bulkDelete(botMessages).then((_message) => {
              message.channel.send(`:broom: \`${_message.size - 1}\` ${lan.success}`).then(msg => msg.delete({
                timeout: 2500
              }))
            })
          })
        } else {
          if (args[1]) {
            const i = parseInt(args[1])

            message.channel.bulkDelete(i + 1, true)
              .then((_message) => {
                message.channel
                  .send(`:broom: \`${_message.size - 1}\` ${lan.success}`).then((sent) => {
                    setTimeout(() => {
                      sent.delete()
                    }, 2500)
                  })
              })
          } else {
            message.channel.send(`<:win_information:876119543968305233> ${lan.missing_arg} \`${result[0].guild_prefix}del <cantidad> \``)
          }
        }
      }
    } else {
      message.channel.send(`<:pingu_false:876103413526564924> ${lan.permerror}`)
    }
  }
}
