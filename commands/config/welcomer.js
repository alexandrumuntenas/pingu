const { Permissions } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')
const { fetchConfig } = require('../../modules/welcomerModule')
const emojiStrip = require('emoji-strip')

module.exports = {
  name: 'welcomer',
  execute (client, locale, message) {
    fetchConfig(client, message.guild, (data) => {
      if (data) {
        if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
          if (message.args[0]) {
            switch (message.args[0]) {
              case 'channel': {
                if (message.mentions.channels.first()) {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_CHANNEL_SUCCESS', { WELCOMER_CHANNEL: message.mentions.channels.first() }))
                  })
                } else {
                  genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_CHANNEL_MISSING_ARGS', { WELCOMER_CHANNEL: message.guild.channels.cache.find(c => c.id === data.welcomeChannel) }))
                }
                break
              }
              case 'message': {
                const filter = m => m.author.id === message.author.id
                message.channel.awaitMessages({ filter, max: 1, time: 15000 }).then(collected => {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeMessage` = ? WHERE `guild` = ?', [emojiStrip(collected.first().content), message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_MESSAGE_SUCCESS', { WELCOMER_MESSAGE: `\`${emojiStrip(collected.first().content)}\`` }))
                  })
                })

                // Buscar forma de poder mostrar el mensaje actual
                break
              }
            }
          } else {
            helpTray(message, locale)
          }
        } else {
          genericMessages.Error.permerror(message, locale)
        }
      } else {
        genericMessages.Info.status(message, getLocales(locale, 'WELCOMER_INITIALIZE'))
      }
    })
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `\`${message.database.guild_prefix}welcomer <option>\``, ['channel <channel>', 'message', 'enableCards', 'disableCards', 'defaultBackground <background ID>', 'customBackground <background URL>', 'overlayOpacity <quantity>', 'overlayBlur <quantity>', 'roundAvatar <true/false>', 'test', 'simulate'])
}
