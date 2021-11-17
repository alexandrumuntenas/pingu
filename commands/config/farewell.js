const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../functions/genericMessages')
const getLocales = require('../../i18n/getLocales')
const guildMemberRemove = require('../../events/guildMemberRemove')

module.exports = {
  cooldown: 0,
  name: 'farewell',
  execute (client, locale, message) {
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      if (message.args[0]) {
        switch (message.args[0]) {
          case 'viewconfig': {
            message.channel.send('<a:loader:871389840904695838> Fetching data... Please wait.').then((_message) => {
              const sentEmbed = new MessageEmbed()
                .setColor('BLURPLE')
                .setTitle(getLocales(locale, 'FAREWELL_VIEWCONFIG_TITLE'))
                .setDescription(getLocales(locale, 'FAREWELL_VIEWCONFIG_DESCRIPTION'))
                .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.farewellChannel) || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
                .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${message.database.farewellMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)

              _message.edit({ content: 'Done', embeds: [sentEmbed] })
            })
            break
          }
          case 'channel': {
            if (message.mentions.channels.first()) {
              client.pool.query('UPDATE `guildData` SET `farewellChannel` = ? WHERE `guild` = ?', [message.mentions.channels.first().id, message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'FAREWELL_CHANNEL_SUCCESS', { FAREWELL_CHANNEL: message.mentions.channels.first() }))
              })
            } else {
              genericMessages.Info.status(message, getLocales(locale, 'FAREWELL_CHANNEL_MISSING_ARGS', { FAREWELL_CHANNEL: message.guild.channels.cache.find(c => c.id === message.database.farewellChannel) }))
            }
            break
          }
          case 'message': {
            const filter = m => m.author.id === message.author.id
            genericMessages.Info.status(message, getLocales(locale, 'FAREWELL_MESSAGE_PREUPDATE'))
            message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
              client.pool.query('UPDATE `guildData` SET `farewellMessage` = ? WHERE `guild` = ?', [collected.first().content, message.guild.id], (err) => {
                if (err) client.Sentry.captureException(err)
                genericMessages.success(message, getLocales(locale, 'FAREWELL_MESSAGE_SUCCESS', { FAREWELL_MESSAGE: `\`${collected.first().content}\`` }))
              })
            })
            break
          }
          case 'simulate': {
            genericMessages.Info.status(message, getLocales(locale, 'FAREWELL_SIMULATE_SUCCESS'))
            guildMemberRemove(client, message.member)
            break
          }
          default: {
            helpTray(message, locale)
            break
          }
        }
      } else {
        helpTray(message, locale)
      }
    } else {
      genericMessages.error.permissionerror(message, locale)
    }
  }
}

const helpTray = (message, locale) => {
  genericMessages.Info.help(message, locale, `\`${message.database.guildPrefix}farewell <option>\``, ['viewconfig', 'channel <channel>', 'message', 'simulate'])
}
