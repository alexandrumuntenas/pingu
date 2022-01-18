const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { welcomeCard } = require('../../modules/canvasProcessing')
const { Success, Status, Help, Loader } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const tempFileRemover = require('../../functions/tempFileRemover')
const guildMemberAdd = require('../../events/guildMemberAdd').execute
const isHexColor = require('is-hexcolor')
const { SlashCommandBuilder } = require('@discordjs/builders')
const updateGuildConfig = require('../../functions/updateGuildConfig')

const emojiRelationship = { 0: '<:discord_offline:876102753821278238>', 1: '<:discord_online:876102925129236481>' }

module.exports = {
  module: 'welcome',
  name: 'welcomer',
  description: '⚙️ Configure the welcomer module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('welcomer')
    .setDescription('Configure the welcomer module')
    .addSubcommand(subcommand => subcommand.setName('viewconfig').setDescription('View the current welcomer configuration'))
    .addSubcommand(subcommand => subcommand.setName('setchannel').setDescription('Set the welcomer channel').addChannelOption(option => option.setName('channel').setDescription('Select a channel').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('setmessage').setDescription('Set the welcomer message').addStringOption(option => option.setName('message').setDescription('The message to be sent. Avaliable placeholders: {member} {guild}').setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName('enablecards').setDescription('Enable the welcomer cards'))
    .addSubcommand(subcommand => subcommand.setName('disablecards').setDescription('Disable the welcomer cards')) //! ESTO TIENE QUE DESAPARECER //TODO: FUSIONAR ESTE SUBCOMANDO CON ENABLECARDS PARA SIMPLIFICAR LAS OPCIONES
    .addSubcommand(subcommand => subcommand.setName('configurecard').setDescription('Configure the welcome card').addNumberOption(option => option.setName('setoverlayopacity').setDescription('Enter a number')).addStringOption(option => option.setName('setoverlaycolor').setDescription('Enter a hex color')).addStringOption(option => option.setName('setbackgroundurl').setDescription('Enter a valid image URL')))
    .addSubcommand(subcommand => subcommand.setName('previewcard').setDescription('Preview the welcome card'))
    .addSubcommand(subcommand => subcommand.setName('simulate').setDescription('Simulate the welcomer message')),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewconfig': {
        const configStatus = new MessageEmbed()
          .setColor('BLURPLE')
          .setTitle(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:DESCRIPTION'))
          .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${interaction.guild.channels.cache.find(c => c.id === interaction.database.welcomeChannel) || i18n(locale, 'UNSET')}`, true)
          .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${interaction.database.welcomeMessage || i18n(locale, 'UNSET')}`, true)
          .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS')}`, `${i18n(locale, 'STATUS')}: ${emojiRelationship[interaction.database.welcomeImage]}\n${i18n(locale, 'BACKGROUND')} [Ver imagen](${interaction.database.welcomeImageCustomBackground})\n${i18n(locale, 'OVERLAYCOLOR')}: ${interaction.database.welcomeImageCustomOverlayColor}\n${i18n(locale, 'OVERLAYOPACITY')}: ${interaction.database.welcomeImageCustomOpacity}\n${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS:ROUNDAVATAR')}: ${emojiRelationship[interaction.database.welcomeImageRoundAvatar]}`, false)

        interaction.editReply({ embeds: [configStatus] })
        break
      }
      case 'setchannel': {
        updateGuildConfig(client, interaction.guild, { column: 'welcomeChannel', value: interaction.options.getChannel('welcomechannel').id }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::SETCHANNEL:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }
      case 'setmessage': {
        updateGuildConfig(client, interaction.guild, { column: 'welcomeMessage', value: interaction.options.getString('message') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::SETMESSAGE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::SETMESSAGE:SUCCESS', { MESSAGE: `\`${interaction.options.getString('message')}\`` }))] })
        })
        break
      }
      case 'setbackground': {
        updateGuildConfig(client, interaction.guild, { column: 'welcomeImageCustomBackground', value: interaction.options.getString('url') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::SETBACKGROUND:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::SETBACKGROUND:SUCCESS', { URL: interaction.options.getString('url') }))] })
        })
        break
      }
      case 'enablecards': {
        updateGuildConfig(client, interaction.guild, { column: 'welcomeImage', value: 1 }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::ENABLECARDS:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::ENABLECARDS:SUCCESS'))] })
        })
        break
      }
      case 'disablecards': {
        updateGuildConfig(client, interaction.guild, { column: 'welcomeImage', value: 0 }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'WELCOMER::DISABLECARDS:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'WELCOMER::DISABLECARDS:SUCCESS'))] })
        })
        break
      }
      case 'configurecard': {
        const overlayOpacity = interaction.options.getNumber('setoverlayopacity')
        let overlayColor = interaction.options.getString('setoverlaycolor')
        const background = interaction.options.getString('setbackgroundurl')

        const configureCardEmbed = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(locale, 'WELCOMER::CONFIGURECARD:EMBED:TITLE'))

        if (overlayOpacity) {
          if (!(parseInt(overlayOpacity) <= 100 && parseInt(overlayOpacity) >= 0)) configureCardEmbed.addField(`<:syntax:933018105137999953> ${i18n(locale, 'OVERLAYOPACITY')}`, `${i18n(locale, 'WELCOMER::CONFIGURECARD:OVERLAYOPACITY:ERROR')}`, false)
          else configureCardEmbed.addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'OVERLAYOPACITY')}`, `${i18n(locale, 'WELCOMER::CONFIGURECARD:OVERLAYOPACITY:SUCCESS', { OPACITY: overlayOpacity })}`, false)
        }
        if (overlayColor) {
          if (!overlayColor.startsWith('#')) overlayColor = `#${overlayColor}`
          if (overlayColor && !isHexColor(overlayColor)) configureCardEmbed.addField(`<:syntax:933018105137999953> ${i18n(locale, 'OVERLAYCOLOR')}`, `${i18n(locale, 'WELCOMER::CONFIGURECARD:OVERLAYCOLOR:ERROR')}`, false)
          else configureCardEmbed.addField(`<:syntax:933018105137999953> ${i18n(locale, 'OVERLAYCOLOR')}`, `${i18n(locale, 'WELCOMER::CONFIGURECARD:OVERLAYCOLOR:SUCCESS', { COLOR: overlayColor })}`, false)
        }
        if (background) configureCardEmbed.addField(`<:syntax:933018105137999953> ${i18n(locale, 'BACKGROUND')}`, `${i18n(locale, 'WELCOMER::CONFIGURECARD:BACKGROUND:SUCCESS', { BACKGROUND: background })}`, false)

        if (!(overlayColor || overlayOpacity || background)) {
          interaction.editReply({ embeds: [new MessageEmbed().setColor(interaction.database.welcomeImageCustomOverlayColor).setTitle(`<:blurple_image:892443053359517696> ${i18n(locale, 'WELCOMER::CONFIGURECARD:EMBED:TITLE')}`).setDescription(`${i18n(locale, 'BACKGROUND')}: [Ver imagen](${interaction.database.welcomeImageCustomBackground})\n${i18n(locale, 'OVERLAYCOLOR')}: ${interaction.database.welcomeImageCustomOverlayColor}\n${i18n(locale, 'OVERLAYOPACITY')}: ${interaction.database.welcomeImageCustomOpacity}`)] })
        } else {
          client.pool.query('UPDATE `guildData` SET `welcomeImageCustomOverlayColor` = ?, `welcomeImageCustomBackground` = ?, `welcomeImageCustomOpacity` = ? WHERE guild = ?', [overlayColor || interaction.database.welcomeImageCustomOverlayColor, background || interaction.database.welcomeImageCustomBackground, overlayOpacity || interaction.database.welcomeImageCustomOpacity, interaction.guild.id], (err) => {
            if (err) client.logError(err)
            interaction.editReply({ embeds: [configureCardEmbed] })
          })
        }
        break
      }
      case 'previewcard': {
        welcomeCard(client, interaction.member, locale, interaction.database).then((paths) => {
          const attachmentSent = new MessageAttachment(paths.attachmentSent)
          interaction.editReply({ files: [attachmentSent] }).then(() => {
            tempFileRemover(paths)
          })
        })
        break
      }
      case 'simulate': {
        interaction.editReply({ embeds: [Status(i18n(locale, 'WELCOMER::SIMULATE:SENDING'))] })
        guildMemberAdd(client, interaction.member)
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('welcomer', i18n(locale, 'WELCOMER::HELPTRAY:DESCRIPTION'), [{ option: 'viewconfig', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:VIEWCONFIG') }, { option: 'enablecards', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:ENABLECARDS') }, { option: 'disablecards', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:DISABLECARDS') }, { option: 'test', description: i18n(locale, 'WELCOMER::xºHELPTRAY:OPTION:TEST') }, { option: 'simulate', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:SIMULATE') }, { option: 'setbackground', description: i18n(locale, 'WELCOMER::HELPTRAY:OPTION:SETBACKGROUND'), syntax: 'setbackground <url>' }])
    if (!(message.args && Object.prototype.hasOwnProperty.call(message.args, 0))) return message.reply({ embeds: [helpTray] })
    switch (message.args[0]) {
      case 'viewconfig': {
        message.reply({ embeds: [Loader(i18n(locale, 'FETCHINGDATA'))] }).then((_message) => {
          const sentEmbed = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:TITLE'))
            .setDescription(i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:DESCRIPTION'))
            .addField(`<:blurple_announcements:892441292909469726> ${i18n(locale, 'CHANNEL')}`, `${message.guild.channels.cache.find(c => c.id === message.database.welcomeChannel) || i18n(locale, 'UNSET')}`, true)
            .addField(`<:blurple_chat:892441341827616859> ${i18n(locale, 'MESSAGE')}`, `${message.database.welcomeMessage || i18n(locale, 'UNSET')}`, true)
            .addField(`<:blurple_image:892443053359517696> ${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS')}`, `${i18n(locale, 'STATUS')}: ${emojiRelationship[message.database.welcomeImage]}\n${i18n(locale, 'BACKGROUND')} [Ver imagen](${message.database.welcomeImageCustomBackground})\n${i18n(locale, 'OVERLAYCOLOR')}: ${message.database.welcomeImageCustomOverlayColor}\n${i18n(locale, 'OVERLAYOPACITY')}: ${message.database.welcomeImageCustomOpacity}\n${i18n(locale, 'WELCOMER::VIEWCONFIG:EMBED:WELCOMECARDS:ROUNDAVATAR')}: ${emojiRelationship[message.database.welcomeImageRoundAvatar]}`, false)

          _message.edit({ embeds: [sentEmbed] })
        })
        break
      }
      case 'setchannel': {
        if (!message.mentions.channels.first()) return message.reply({ embeds: [helpTray] })
        updateGuildConfig(client, message.guild, { column: 'welcomeChannel', value: message.mentions.channels.first().id }, (err) => {
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'WELCOMER::SETCHANNEL:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::SETCHANNEL:SUCCESS', { CHANNEL: message.mentions.channels.first() }))] })
        })
        break
      }
      case 'setmessage': {
        updateGuildConfig(client, message.guild, { column: 'welcomeMessage', value: message.content.replace(`${message.database.guildPrefix}welcomer setmessage `, '') }, (err) => {
          if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'WELCOMER::SETMESSAGE:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::SETMESSAGE:SUCCESS', { MESSAGE: message.content.replace(`${message.database.guildPrefix}welcomer setmessage `, '') }))] })
        })
        break
      }
      case 'enablecards': {
        updateGuildConfig(client, message.guild, { column: 'welcomeImage', value: 1 }, (err) => {
          if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'WELCOMER::ENABLECARDS:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::ENABLECARDS:SUCCESS'))] })
        })
        break
      }
      case 'disablecards': {
        updateGuildConfig(client, message.guild, { column: 'welcomeImage', value: 0 }, (err) => {
          if (err) return message.channel.send({ embeds: [Error(i18n(locale, 'WELCOMER::DISABLECARDS:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'WELCOMER::DISABLECARDS:SUCCESS'))] })
        })
        break
      }
      case 'test': {
        welcomeCard(client, message.member, locale, message.database).then((paths) => {
          const attachmentSent = new MessageAttachment(paths.attachmentSent)
          message.reply({ files: [attachmentSent] }).then(() => {
            tempFileRemover(paths)
          })
        })
        break
      }
      case 'simulate': {
        message.reply({ embeds: [Status(i18n(locale, 'WELCOMER::SIMULATE:SENDING'))] })
        guildMemberAdd(client, message.member)
        break
      }
      default: {
        message.reply({ embeds: [helpTray] })
        break
      }
    }
  }
}
