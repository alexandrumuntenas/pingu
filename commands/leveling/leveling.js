/* eslint-disable max-depth */
const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const i18n = require('../../i18n/i18n')
const { generateRankCard, resetLeaderboard } = require('../../modules/leveling')
const { actualizarConfiguracionDelServidor } = require('../../functions/guildManager')
const { plantillas } = require('../../functions/messageManager')

const channelRelationShip = { 0: 'disabled', 1: 'Same Channel Where Message Is Sent' }
const hexRegexTester = /^#(?<hex>[0-9a-f]{3}){1,2}$/i

module.exports = {
  name: 'leveling',
  module: 'leveling',
  description: '⚙️ Configure the leveling module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1,
  isConfigurationCommand: true,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('viewconfig').setDescription('View the current leveling configuration'))
    .addSubcommand(sc => sc.setName('rankup').setDescription('Configure the rankup settings')
      .addStringOption(input => input.setName('channel').setDescription('Set the channel where rank up message is sent.').addChoice('This channel', 'this').addChoice('Same channel where message is sent', 'same').addChoice('Send to user DM', 'dm').addChoice('Disable', 'disabled'))
      .addStringOption(input => input.setName('message').setDescription('Set the rankup message.'))
      .addNumberOption(input => input.setName('difficulty').setDescription('Set the difficulty of the leveling system.')))
    .addSubcommand(sc => sc.setName('configurecards').setDescription('Configure the rank cards.')
      .addStringOption(input => input.setName('backgroundurl').setDescription('Set the background image url.'))
      .addNumberOption(input => input.setName('overlayopacity').setDescription('Set the overlay opacity.'))
      .addStringOption(input => input.setName('overlaycolor').setDescription('Set the overlay color.')))
    .addSubcommand(sc => sc.setName('resetleaderboard').setDescription('Reset the leaderboard.')),
  runInteraction ( interaction) {
    function viewConfigFallback () {
      generateRankCard(interaction.member, card => {
        const attachmentRankCard = new MessageAttachment(card, 'rankcard.png')

        let rankUpChannel = interaction.member.guild.configuration.leveling.channel

        rankUpChannel = channelRelationShip[rankUpChannel] ? channelRelationShip[rankUpChannel] : `<#${rankUpChannel}>`

        const levelingBasicConfig = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:TITLE'))
          .setDescription(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:DESCRIPTION'))
          .addField(`<:blurple_chat:892441341827616859> ${i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKUPCHANNEL')}`, interaction.member.guild.configuration.leveling.channel ? rankUpChannel : i18n(guild.preferredLocale, 'NOSET'))
          .addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKUPMESSAGE')}`, interaction.member.guild.configuration.leveling.message ? interaction.member.guild.configuration.leveling.message : i18n(guild.preferredLocale, 'NOSET'))
          .addField(`<:trendingdown_green:967797814212034601> ${i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:DIFFICULTY')}`, interaction.member.guild.configuration.leveling.difficulty ? `${interaction.member.guild.configuration.leveling.difficulty}` : i18n(guild.preferredLocale, 'NOSET'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        const levelingRankCard = new MessageEmbed()
          .setTitle(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKCARD:TITLE'))
          .setDescription(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKCARD:DESCRIPTION'))
          .addField(`:frame_photo: ${i18n(guild.preferredLocale, 'BACKGROUND')}`, interaction.guild.configuration.leveling.card.background ? `[<:blurple_link:892441999993618532> ${i18n(guild.preferredLocale, 'VIEWLINK')}](${interaction.guild.configuration.welcome.welcomecard.background})` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:flashlight: ${i18n(guild.preferredLocale, 'OVERLAYOPACITY')}`, interaction.guild.configuration.leveling.card.overlay.opacity ? `${interaction.guild.configuration.welcome.welcomecard.overlay.opacity}%` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:art: ${i18n(guild.preferredLocale, 'OVERLAYCOLOR')}`, interaction.guild.configuration.leveling.card.overlay.color || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
          .setColor('#2F3136')
          .setImage('attachment://rankcard.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        interaction.editReply({ embeds: [levelingBasicConfig, levelingRankCard], files: [attachmentRankCard] })
      })
    }

    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        viewConfigFallback()
        break
      }

      case 'rankup': {
        const rankUpChannel = interaction.options.getString('channel')
        const rankUpMessage = interaction.options.getString('message')
        const difficulty = interaction.options.getNumber('difficulty')
        const newconfig = {}

        if (rankUpChannel || rankUpMessage || difficulty) {
          const modifiedconfig = new MessageEmbed()
            .setColor('#2F3136')
            .setTitle(i18n(guild.preferredLocale, 'LEVELING::RANKUP:TITLE'))
            .setDescription(i18n(guild.preferredLocale, 'LEVELING::RANKUP:DESCRIPTION'))
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
            .setTimestamp()

          if (rankUpChannel) {
            switch (rankUpChannel) {
              case 'this': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, `<#${interaction.channel.id}>`, true)
                newconfig.channel = interaction.channel.id
                break
              }
              case 'same': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SAME_WHERE_MESSAGE_IS_SENT'), true)
                newconfig.channel = rankUpChannel
                break
              }
              case 'dm': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:DM'), true)
                newconfig.channel = rankUpChannel
                break
              }
              case 'disabled': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:DISABLED'), true)
                newconfig.channel = rankUpChannel
                break
              }
              default: {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SAME_WHERE_MESSAGE_IS_SENT'), true)
                newconfig.channel = rankUpChannel
                break
              }
            }
          }

          if (rankUpMessage) {
            modifiedconfig.addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(guild.preferredLocale, 'LEVELING::RANKUP:MESSAGE')}`, rankUpMessage, true)
            newconfig.message = rankUpMessage
          }

          if (difficulty) {
            modifiedconfig.addField(`<:trendingdown_green:967797814212034601> ${i18n(guild.preferredLocale, 'LEVELING::RANKUP:DIFFICULTY')}`, difficulty, true)
            newconfig.difficulty = difficulty
          }

          actualizarConfiguracionDelServidor(interaction.guild, { column: 'leveling', newconfig }, err => {
            if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'LEVELING::RANKUP:ERROR'))] })
            return interaction.editReply({ embeds: [modifiedconfig] })
          })
        } else {
          viewConfigFallback()
        }

        break
      }

      case 'configurecards': {
        const background = interaction.options.getString('backgroundurl')
        const overlayOpacity = interaction.options.getNumber('overlayopacity')
        const overlayColor = interaction.options.getString('overlaycolor')
        const newconfig = {}

        if (background || overlayOpacity || overlayColor) {
          const modifiedconfig = new MessageEmbed()
            .setColor('#2F3136')
            .setTitle(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:TITLE'))
            .setDescription(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:DESCRIPTION'))
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
            .setTimestamp()

          if (background) {
            modifiedconfig.addField(`:frame_photo: ${i18n(guild.preferredLocale, 'BACKGROUND')}`, `[<:blurple_link:892441999993618532> ${i18n(guild.preferredLocale, 'VIEWLINK')}](${background})`, true)
            newconfig.background = background
          }

          if (overlayOpacity) {
            modifiedconfig.addField(`:flashlight: ${i18n(guild.preferredLocale, 'OVERLAYOPACITY')}`, `${overlayOpacity}%`, true)
            newconfig.overlayOpacity = overlayOpacity
          }

          if (overlayColor && overlayColor.test(overlayColor)) {
            modifiedconfig.addField(`:art: ${i18n(guild.preferredLocale, 'OVERLAYCOLOR')}`, overlayColor, true)
            newconfig.overlayColor = overlayColor
          }

          actualizarConfiguracionDelServidor(interaction.guild, { column: 'leveling', newconfig }, err => {
            if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:ERROR'))] })
            return interaction.editReply({ embeds: [modifiedconfig] })
          })
        } else {
          viewConfigFallback()
        }

        break
      }

      case 'resetleaderboard': {
        resetLeaderboard(interaction.guild, (err) => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'LEVELING::RESETLEADERBOARD:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RESETLEADERBOARD:SUCCESS'))] })
        })
        break
      }

      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(guild.preferredLocale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  },
  // eslint-disable-next-line complexity
  runCommand ( message) {
    function sendHelp () {
      message.reply({
        embeds: plantillas.ayuda({
          name: 'leveling',
          description: i18n(guild.preferredLocale, 'LEVELING::DESCRIPTION'),
          module: 'leveling',
          subcommands: [
            { name: 'viewconfig', description: i18n(guild.preferredLocale, 'LEVELING::HELP:VIEWCONFIG:DESCRIPTION') },
            { name: 'configurecards viewconfig', description: i18n(guild.preferredLocale, 'LEVELING::HELP:CONFIGURECARDS:VIEWCONFIG:DESCRIPTION') },
            { name: 'configurecards backgroundurl', description: i18n(guild.preferredLocale, 'LEVELING::HELP:CONFIGURECARDS:BACKGROUNDURL:DESCRIPTION'), parameters: '<url>' },
            { name: 'configurecards overlayopacity', description: i18n(guild.preferredLocale, 'LEVELING::HELP:CONFIGURECARDS:OVERLAYOPACITY:DESCRIPTION'), parameters: '<0-100>' },
            { name: 'configurecards overlaycolor', description: i18n(guild.preferredLocale, 'LEVELING::HELP:CONFIGURECARDS:OVERLAYCOLOR:DESCRIPTION'), parameters: '<hex color>' },
            { name: 'rankup channel', description: i18n(guild.preferredLocale, 'LEVELING::HELP:RANKUP:CHANNEL:DESCRIPTION'), parameters: '<this/same/dm/disabled>' },
            { name: 'rankup message', description: i18n(guild.preferredLocale, 'LEVELING::HELP:RANKUP:MESSAGE:DESCRIPTION'), parameters: '<message>' },
            { name: 'rankup difficulty', description: i18n(guild.preferredLocale, 'LEVELING::HELP:RANKUP:DIFFICULTY:DESCRIPTION'), parameters: '<difficulty>' }
          ]
        })
      })
    }

    function viewConfigFallback () {
      generateRankCard(message.member, card => {
        const attachmentRankCard = new MessageAttachment(card, 'rankcard.png')

        let rankUpChannel = message.member.guild.configuration.leveling.channel

        rankUpChannel = channelRelationShip[rankUpChannel] ? channelRelationShip[rankUpChannel] : `<#${rankUpChannel}>`

        const levelingBasicConfig = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:TITLE'))
          .setDescription(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:DESCRIPTION'))
          .addField(`<:blurple_chat:892441341827616859> ${i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKUPCHANNEL')}`, message.member.guild.configuration.leveling.channel ? rankUpChannel : i18n(guild.preferredLocale, 'NOSET'))
          .addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKUPMESSAGE')}`, message.member.guild.configuration.leveling.message ? message.member.guild.configuration.leveling.message : i18n(guild.preferredLocale, 'NOSET'))
          .addField(`<:trendingdown_green:967797814212034601> ${i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:DIFFICULTY')}`, message.member.guild.configuration.leveling.difficulty ? `${message.member.guild.configuration.leveling.difficulty}` : i18n(guild.preferredLocale, 'NOSET'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        const levelingRankCard = new MessageEmbed()
          .setTitle(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKCARD:TITLE'))
          .setDescription(i18n(guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKCARD:DESCRIPTION'))
          .addField(`:frame_photo: ${i18n(guild.preferredLocale, 'BACKGROUND')}`, message.guild.configuration.leveling.card.background ? `[<:blurple_link:892441999993618532> ${i18n(guild.preferredLocale, 'VIEWLINK')}](${message.guild.configuration.leveling.card.background})` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:flashlight: ${i18n(guild.preferredLocale, 'OVERLAYOPACITY')}`, message.guild.configuration.leveling.card.overlay.opacity ? `${message.guild.configuration.leveling.card.overlay.opacity}%` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:art: ${i18n(guild.preferredLocale, 'OVERLAYCOLOR')}`, message.guild.configuration.leveling.card.overlay.color || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
          .setColor('#2F3136')
          .setImage('attachment://rankcard.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        message.reply({ embeds: [levelingBasicConfig, levelingRankCard], files: [attachmentRankCard] })
      })
    }

    if (!Object.prototype.hasOwnProperty.call(message.parameters, 0)) return sendHelp()

    switch (message.parameters[0]) {
      case 'viewconfig': {
        viewConfigFallback()
        break
      }

      case 'configurecards': {
        if (!(Object.prototype.hasOwnProperty.call(message.parameters, 1) && Object.prototype.hasOwnProperty.call(message.parameters, 2))) return sendHelp()
        switch (message.parameters[1]) {
          case 'backgroundurl': {
            actualizarConfiguracionDelServidor(message.guild, { column: 'leveling', newconfig: { card: { background: message.parameters[2] } } }, err => {
              if (err) return message.reply(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:BACKGROUNDURL:ERROR'))
              return message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:BACKGROUNDURL:SUCCESS', { URL: message.parameters[2] }))] })
            })

            break
          }

          case 'overlayopacity': {
            if (parseInt(message.parameters[2], 10) <= 0) {
              message.parameters[2] = '0'
            } else if (parseInt(message.parameters[2], 10) >= 100) {
              message.parameters[2] = '100'
            }

            actualizarConfiguracionDelServidor(message.guild, { column: 'leveling', newconfig: { card: { overlay: { opacity: parseInt(message.parameters[2], 10) } } } }, err => {
              if (err) return message.reply(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:OVERLAYOPACITY:ERROR'))
              return message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:OVERLAYOPACITY:SUCCESS', { OPACITY: parseInt(message.parameters[2], 10) }))] })
            })

            break
          }

          case 'overlaycolor': {
            if (!hexRegexTester.test(message.parameters[2])) return message.reply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:OVERLAYCOLOR:NOTHEX'))] })

            actualizarConfiguracionDelServidor(message.guild, { column: 'leveling', newconfig: { card: { overlay: { color: message.parameters[2] } } } }, err => {
              if (err) return message.reply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:OVERLAYCOLOR:ERROR'))] })
              return message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::CONFIGURECARDS:OVERLAYCOLOR:SUCCESS', { COLOR: message.parameters[2] }))] })
            })

            break
          }

          default: {
            sendHelp()
            break
          }
        }

        break
      }

      case 'rankup': {
        if (!(Object.prototype.hasOwnProperty.call(message.parameters, 1) && Object.prototype.hasOwnProperty.call(message.parameters, 2))) return sendHelp()
        switch (message.parameters[1]) {
          case 'channel': {
            if (!(Object.prototype.hasOwnProperty.call(message.parameters, 2) && ['this', 'same', 'dm', 'disabled'].includes(message.parameters[2]))) return sendHelp()
            if (message.parameters[2] === 'this') message.parameters[2] = message.channel.id

            actualizarConfiguracionDelServidor(message.guild, { column: 'leveling', newconfig: { channel: message.parameters[2] } }, err => {
              if (err) return message.reply(i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:ERROR'))
              switch (message.parameters[2]) {
                case 'this': {
                  message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SUCCESS', { CHANNEL: `<#${message.parameters[2]}>` }))] })
                  break
                }
                case 'same': {
                  message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SUCCESS', { CHANNEL: i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SAME_WHERE_MESSAGE_IS_SENT') }))] })
                  break
                }
                case 'dm': {
                  message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SUCCESS', { CHANNEL: i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:DM') }))] })
                  break
                }
                case 'disabled': {
                  message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SUCCESS', { CHANNEL: i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:DISABLED') }))] })
                  break
                }
                default: {
                  message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SUCCESS', { CHANNEL: `<#${message.parameters[2]}>` }))] })
                  break
                }
              }
            })

            break
          }

          case 'message': {
            const rankupMessage = message.parameters.slice(2).join(' ')
            actualizarConfiguracionDelServidor(message.guild, { column: 'leveling', newconfig: { message: rankupMessage } }, err => {
              if (err) {
                message.reply(i18n(guild.preferredLocale, 'LEVELING::RANKUP:MESSAGE:ERROR'))
                return
              }

              message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RANKUP:MESSAGE:SUCCESS', { MESSAGE: rankupMessage }))] })
            })
            break
          }

          case 'difficulty': {
            if (parseInt(message.parameters[2], 10) <= 0) {
              message.parameters[2] = '0'
            } else if (parseInt(message.parameters[2], 10) >= 100) {
              message.parameters[2] = '100'
            }

            actualizarConfiguracionDelServidor(message.guild, { column: 'leveling', newconfig: { difficulty: parseInt(message.parameters[2], 10) } }, err => {
              if (err) {
                message.reply(i18n(guild.preferredLocale, 'LEVELING::RANKUP:DIFFICULTY:ERROR'))
                return
              }

              message.reply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'LEVELING::RANKUP:DIFFICULTY:SUCCESS', { DIFFICULTY: parseInt(message.parameters[2], 10) }))] })
            })
            break
          }

          default: {
            sendHelp()
            break
          }
        }
        break
      }

      default: {
        sendHelp()
        break
      }
    }
  }
}
