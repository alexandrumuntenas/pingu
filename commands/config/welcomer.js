const { Permissions, MessageEmbed } = require('discord.js')
const genericMessages = require('../../modules/genericMessages')
const getLocales = require('../../modules/getLocales')
const { fetchConfig } = require('../../modules/welcomerModule')
const emojiStrip = require('emoji-strip')

const emojiRelationship = { 0: '<:discord_offline:876102753821278238>', 1: '<:discord_online:876102925129236481>' }

module.exports = {
  name: 'welcomer',
  execute (client, locale, message) {
    fetchConfig(client, message.guild, (data) => {
      if (data) {
        if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
          if (message.args[0]) {
            switch (message.args[0]) {
              case 'viewconfig': {
                message.channel.send('<a:loading:880765834774073344> Fetching data... Please wait.').then((_message) => {
                  const roles = new Set()

                  let rolset = ''

                  data.welcomeRoles.split(',').forEach(element => {
                    roles.add(element)
                  })

                  roles.forEach(element => {
                    rolset = rolset + '<@&' + element + '> '
                  })

                  const sentEmbed = new MessageEmbed()
                    .setColor('#17A2B8')
                    .setTitle(getLocales(locale, 'WELCOMER_VIEWCONFIG_TITLE'))
                    .setDescription(getLocales(locale, 'WELCOMER_VIEWCONFIG_DESCRIPTION'))
                    .addField(`<:blurple_announcements:892441292909469726> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === data.welcomeChannel) || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOCHANNEL')}`, true)
                    .addField(`<:blurple_chat:892441341827616859> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_MESSAGE')}`, `${data.welcomeMessage || getLocales(locale, 'WELCOMER_VIEWCONFIG_NOMESSAGE')}`, true)
                    .addField(`<:blurple_image:892443053359517696> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_TITLE')}`, `${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ENABLED', { WELCOMER_BACKGROUND_STATUS: emojiRelationship[data.welcomeImage] })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_DEFAULTBACKGROUND', { WELCOMER_DEFAULTBACKGROUND: data.welcomeImageBackground })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_CUSTOMBACKGROUND', { WELCOMER_CUSTOMBACKGROUND: `[Ver imagen](${data.welcomeImageCustomBackground})` || getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_NOCUSTOMBACKGROUND') })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYBLUR', { WELCOMER_OVELAYBLUR: data.welcomeImageCustomBlur })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_OVERLAYOPACITY', { WELCOMER_OVERLAYOPACITY: data.welcomeImageCustomOpacity })}\n${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ROUNDAVATAR', { WELCOMER_ROUNDAVATAR: emojiRelationship[data.welcomeImageRoundAvatar] })}`, false)
                    .addField(`<:blurple_gift:892455451004911676> ${getLocales(locale, 'WELCOMER_VIEWCONFIG_WELCOMECARD_ROLES')}`, rolset)

                  _message.edit({ content: 'Done', embeds: [sentEmbed] })
                })
                break
              }
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
                message.channel.awaitMessages({ filter, max: 1 }).then(collected => {
                  client.pool.query('UPDATE `guildWelcomerConfig` SET `welcomeMessage` = ? WHERE `guild` = ?', [emojiStrip(collected.first().content), message.guild.id], (err) => {
                    if (err) client.Sentry.captureException(err)
                    genericMessages.Success(message, getLocales(locale, 'WELCOMER_MESSAGE_SUCCESS', { WELCOMER_MESSAGE: `\`${emojiStrip(collected.first().content)}\`` }))
                  })
                })
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
