/* eslint-disable no-eval */
const genericMessages = require('../../modules/genericMessages')

module.exports = {
  name: 'party',
  execute: async (client, locale, message) => {
    const { DiscordTogether } = require('discord-together')
    client.discordTogether = new DiscordTogether(client)
    if (message.member.voice.channel) {
      if (message.args[0] && message.args[1]) {
        switch (message.args[0]) {
          case 'start': {
            client.discordTogether.createTogetherCode(message.member.voice.channel.id, message.args[1] || 'youtube').then(async invite => {
              message.reply(`Utiliza ${invite.code} para invitar a tus amigos. P.D. Puedes usar \`${message.database.guildPrefix}party invite @miAmigoEspecial\` y ya nos encargamos de mandar la invitación.`)
            })
            break
          }
          case 'invite': {
            if (message.mentions.users.first()) {
              client.discordTogether.createTogetherCode(message.member.voice.channel.id, message.args[1] || 'youtube').then(async invite => {
                message.mentions.users.first().send(`${message.author.tag} te ha invitado a una party. Usa ${invite.code} para entrar.`)
              })
            } else {
              genericMessages.Info.help(message, locale, `${message.database.guildPrefix}party <option>`, ['start <activity>[chess, youtube, poker, betrayal, fishing]', 'invite <activity>[chess, youtube, poker, betrayal, fishing] @user'])
            }
          }
        }
      } else {
        genericMessages.Info.help(message, locale, `${message.database.guildPrefix}party <option>`, ['start <activity>[chess, youtube, poker, betrayal, fishing]', 'invite <activity>[chess, youtube, poker, betrayal, fishing] @user'])
      }
    } else {
      genericMessages.Error.customerror(message, locale, 'PLAYTOGETHER_NOVC')
    }
  }
}
