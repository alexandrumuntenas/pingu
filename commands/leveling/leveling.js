/* eslint-disable max-depth */
const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { generateRankCard, resetLeaderboard } = require('../../modules/leveling')
const { actualizarConfiguracionDelServidor } = require('../../functions/guildManager')
const { plantillas } = require('../../functions/messageManager')

const channelRelationShip = { 0: 'disabled', 1: 'Same Channel Where Message Is Sent' }
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'leveling',
  module: 'leveling',
  description: 'LEVELING::DESCRIPTION',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1,
  isConfigurationCommand: true,
  interaction: new SlashCommandBuilder()
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
  // eslint-disable-next-line complexity
  runInteraction (interaction) {
    function viewConfigFallback () {
      generateRankCard(interaction.member, card => {
        const attachmentRankCard = new MessageAttachment(card, 'rankcard.png')

        let rankUpChannel = interaction.member.guild.configuration.leveling.channel

        rankUpChannel = channelRelationShip[rankUpChannel] ? channelRelationShip[rankUpChannel] : `<#${rankUpChannel}>`

        const levelingBasicConfig = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(interaction.guild.preferredLocale, 'LEVELING::VIEWCONFIG:TITLE'))
          .setDescription(i18n(interaction.guild.preferredLocale, 'LEVELING::VIEWCONFIG:DESCRIPTION'))
          .addField(`<:blurple_chat:892441341827616859> ${i18n(interaction.guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKUPCHANNEL')}`, interaction.member.guild.configuration.leveling.channel ? rankUpChannel : i18n(interaction.guild.preferredLocale, 'NOSET'))
          .addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(interaction.guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKUPMESSAGE')}`, interaction.member.guild.configuration.leveling.message ? interaction.member.guild.configuration.leveling.message : i18n(interaction.guild.preferredLocale, 'NOSET'))
          .addField(`<:trendingdown_green:967797814212034601> ${i18n(interaction.guild.preferredLocale, 'LEVELING::VIEWCONFIG:DIFFICULTY')}`, interaction.member.guild.configuration.leveling.difficulty ? `${interaction.member.guild.configuration.leveling.difficulty}` : i18n(interaction.guild.preferredLocale, 'NOSET'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        const levelingRankCard = new MessageEmbed()
          .setTitle(i18n(interaction.guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKCARD:TITLE'))
          .setDescription(i18n(interaction.guild.preferredLocale, 'LEVELING::VIEWCONFIG:RANKCARD:DESCRIPTION'))
          .addField(`:frame_photo: ${i18n(interaction.guild.preferredLocale, 'BACKGROUND')}`, interaction.guild.configuration.leveling.card.background ? `[<:blurple_link:892441999993618532> ${i18n(interaction.guild.preferredLocale, 'VIEWLINK')}](${interaction.guild.configuration.welcome.welcomecard.background})` : `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:flashlight: ${i18n(interaction.guild.preferredLocale, 'OVERLAYOPACITY')}`, interaction.guild.configuration.leveling.card.overlay.opacity ? `${interaction.guild.configuration.welcome.welcomecard.overlay.opacity}%` : `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:art: ${i18n(interaction.guild.preferredLocale, 'OVERLAYCOLOR')}`, interaction.guild.configuration.leveling.card.overlay.color || `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
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
            .setTitle(i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:TITLE'))
            .setDescription(i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:DESCRIPTION'))
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
            .setTimestamp()

          if (rankUpChannel) {
            switch (rankUpChannel) {
              case 'this': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, `<#${interaction.channel.id}>`, true)
                newconfig.channel = interaction.channel.id
                break
              }
              case 'same': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SAME_WHERE_MESSAGE_IS_SENT'), true)
                newconfig.channel = rankUpChannel
                break
              }
              case 'dm': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:DM'), true)
                newconfig.channel = rankUpChannel
                break
              }
              case 'disabled': {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:DISABLED'), true)
                newconfig.channel = rankUpChannel
                break
              }
              default: {
                modifiedconfig.addField(`<:blurple_chat:892441341827616859> ${i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL')}`, i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:CHANNEL:SAME_WHERE_MESSAGE_IS_SENT'), true)
                newconfig.channel = rankUpChannel
                break
              }
            }
          }

          if (rankUpMessage) {
            modifiedconfig.addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:MESSAGE')}`, rankUpMessage, true)
            newconfig.message = rankUpMessage
          }

          if (difficulty) {
            modifiedconfig.addField(`<:trendingdown_green:967797814212034601> ${i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:DIFFICULTY')}`, difficulty, true)
            newconfig.difficulty = difficulty
          }

          actualizarConfiguracionDelServidor(interaction.guild, { column: 'leveling', newconfig }, err => {
            if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'LEVELING::RANKUP:ERROR'))] })
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
            .setTitle(i18n(interaction.guild.preferredLocale, 'LEVELING::CONFIGURECARDS:TITLE'))
            .setDescription(i18n(interaction.guild.preferredLocale, 'LEVELING::CONFIGURECARDS:DESCRIPTION'))
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
            .setTimestamp()

          if (background) {
            modifiedconfig.addField(`:frame_photo: ${i18n(interaction.guild.preferredLocale, 'BACKGROUND')}`, `[<:blurple_link:892441999993618532> ${i18n(interaction.guild.preferredLocale, 'VIEWLINK')}](${background})`, true)
            newconfig.background = background
          }

          if (overlayOpacity) {
            modifiedconfig.addField(`:flashlight: ${i18n(interaction.guild.preferredLocale, 'OVERLAYOPACITY')}`, `${overlayOpacity}%`, true)
            newconfig.overlayOpacity = overlayOpacity
          }

          if (overlayColor && overlayColor.test(overlayColor)) {
            modifiedconfig.addField(`:art: ${i18n(interaction.guild.preferredLocale, 'OVERLAYCOLOR')}`, overlayColor, true)
            newconfig.overlayColor = overlayColor
          }

          actualizarConfiguracionDelServidor(interaction.guild, { column: 'leveling', newconfig }, err => {
            if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'LEVELING::CONFIGURECARDS:ERROR'))] })
            return interaction.editReply({ embeds: [modifiedconfig] })
          })
        } else {
          viewConfigFallback()
        }

        break
      }

      case 'resetleaderboard': {
        resetLeaderboard(interaction.guild, (err) => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'LEVELING::RESETLEADERBOARD:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredLocale, 'LEVELING::RESETLEADERBOARD:SUCCESS'))] })
        })
        break
      }

      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(interaction.guild.preferredLocale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}
