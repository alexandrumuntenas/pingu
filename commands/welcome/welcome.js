const { Permissions, MessageEmbed, MessageAttachment } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { actualizarConfiguracionDelServidor } = require('../../functions/guildManager')
const { plantillas } = require('../../functions/messageManager')
const i18n = require('../../i18n/i18n')
const { generateWelcomeCard, addJoinRole, removeJoinRole } = require('../../modules/welcome')
const { ChannelType } = require('discord-api-types/v9')

const hexRegexTester = /^#(?<hex>[0-9a-f]{3}){1,2}$/i

module.exports = {
  name: 'welcome',
  module: 'welcome',
  description: '⚙️ Configure the welcome module',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 1000,
  isConfigurationCommand: true,
  interactionData: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('setchannel').setDescription('Set the welcome channel.').addChannelOption(input => input.setName('channel').setDescription('Set the welcome channel.').setRequired(true).addChannelTypes([ChannelType.GuildText, ChannelType.GuildNews])))
    .addSubcommand(sc => sc.setName('setmessage').setDescription('Set the welcome message.').addStringOption(input => input.setName('message').setDescription('Set the welcome message. Avaliable placeholders: {}').setRequired(true)))
    .addSubcommand(sc => sc.setName('configurecards').setDescription('Configure the welcome card.')
      .addBooleanOption(input => input.setName('sendcards').setDescription('Send welcome card along with the welcome message.'))
      .addStringOption(input => input.setName('backgroundurl').setDescription('Set the background image url.'))
      .addNumberOption(input => input.setName('overlayopacity').setDescription('Set the overlay opacity.'))
      .addStringOption(input => input.setName('overlaycolor').setDescription('Set the overlay color.'))
      .addStringOption(input => input.setName('title').setDescription('Set the title. (The text in white).'))
      .addStringOption(input => input.setName('subtitle').setDescription('Set the subtitle. (The text darker and smaller than the title).')))
    .addSubcommandGroup(scg => scg.setName('configureroles').setDescription('Configure the roles that will be given to the new member.')
      .addSubcommand(sc => sc.setName('list').setDescription('List the roles that are granted when someone joins the guild.'))
      .addSubcommand(sc => sc.setName('give').setDescription('Add a role to grant when someone joins the guild.').addRoleOption(input => input.setName('role').setDescription('Add a role to grant when someone joins the guild.').setRequired(true)))
      .addSubcommand(sc => sc.setName('remove').setDescription('Remove a role to grant when someone joins the guild.').addRoleOption(input => input.setName('role').setDescription('Remove a role to grant when someone joins the guild.').setRequired(true)))),
  runInteraction (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setchannel': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'welcome', newconfig: { channel: interaction.options.getChannel('channel').id } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'WELCOME::SETCHANNEL:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'WELCOME::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }

      case 'setmessage': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'welcome', newconfig: { message: interaction.options.getString('message') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'WELCOME::SETMESSAGE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'WELCOME::SETMESSAGE:SUCCESS', { MESSAGE: interaction.options.getString('message') }))] })
        })
        break
      }

      case 'configurecards': {
        const sendcards = interaction.options.getBoolean('sendcards')
        const backgroundurl = interaction.options.getString('backgroundurl')
        const overlayopacity = interaction.options.getNumber('overlayopacity')
        const overlaycolor = interaction.options.getString('overlaycolor')
        const title = interaction.options.getString('title')
        const subtitle = interaction.options.getString('subtitle')
        const newconfig = { welcomecard: {} }

        if (sendcards || backgroundurl || overlayopacity || overlaycolor || title || subtitle) {
          const modifiedconfig = new MessageEmbed()
            .setColor('#2F3136')
            .setTitle(i18n(guild.preferredLocale, 'WELCOME::CONFIGURECARDS:TITLE'))
            .setDescription(`${i18n(guild.preferredLocale, 'WELCOME::CONFIGURECARDS:CHANGES')}`)
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
            .setTimestamp()

          if (sendcards) {
            modifiedconfig.addField(`:incoming_envelope: ${i18n(guild.preferredLocale, 'SENDCARDS')}`, sendcards ? `✅ ${i18n(guild.preferredLocale, 'ENABLED')}` : `❌ ${i18n(guild.preferredLocale, 'DISABLED')}`, true)
            newconfig.welcomecard.enabled = sendcards
          }

          if (backgroundurl) {
            modifiedconfig.addField(`:frame_photo: ${i18n(guild.preferredLocale, 'BACKGROUND')}`, backgroundurl ? `[<:blurple_link:892441999993618532> ${i18n(guild.preferredLocale, 'VIEWLINK')}](${backgroundurl})` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.background = backgroundurl
          }

          if (overlayopacity) {
            modifiedconfig.addField(`:flashlight: ${i18n(guild.preferredLocale, 'OVERLAYOPACITY')}`, overlayopacity ? `${overlayopacity}%` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.overlay.opacity = overlayopacity

            if (newconfig.welcomecard.overlay) newconfig.welcomecard.overlay.opacity = overlayopacity
            else newconfig.welcomecard.overlay = { opacity: overlayopacity }
          }

          if (overlaycolor && hexRegexTester.test(overlaycolor)) {
            modifiedconfig.addField(`:art: ${i18n(guild.preferredLocale, 'OVERLAYCOLOR')}`, overlaycolor || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)

            if (newconfig.welcomecard.overlay) newconfig.welcomecard.overlay.color = overlaycolor
            else newconfig.welcomecard.overlay = { color: overlaycolor }
          }

          if (title) {
            modifiedconfig.addField(`:writing_hand: ${i18n(guild.preferredLocale, 'TITLE')}`, title || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.title = title
          }

          if (subtitle) {
            modifiedconfig.addField(`:writing_hand: ${i18n(guild.preferredLocale, 'SUBTITLE')}`, subtitle || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.subtitle = subtitle
          }

          actualizarConfiguracionDelServidor(interaction.guild, { column: 'welcome', newconfig }, err => {
            if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'WELCOME::CONFIGURECARDS:ERROR'))] })
            return interaction.editReply({ embeds: [modifiedconfig] })
          })
        } else {
          generateWelcomeCard(interaction.member, path => {
            const welcomecard = new MessageAttachment(path, 'welcomecard.png')
            const actualconfig = new MessageEmbed()
              .setColor('#2F3136')
              .setTitle(i18n(guild.preferredLocale, 'WELCOME::CONFIGURECARDS:TITLE'))
              .setDescription(`${i18n(guild.preferredLocale, 'WELCOME::CONFIGURECARDS:NOCHANGES')} ${i18n(guild.preferredLocale, 'WELCOME::CONFIGURECARDS:ACTUALCONFIG')}`)
              .addField(`:incoming_envelope: ${i18n(guild.preferredLocale, 'SENDCARDS')}`, interaction.guild.configuration.welcome.welcomecard.enabled ? `✅ ${i18n(guild.preferredLocale, 'ENABLED')}` : `❌ ${i18n(guild.preferredLocale, 'DISABLED')}`, true)
              .addField(`:frame_photo: ${i18n(guild.preferredLocale, 'BACKGROUND')}`, interaction.guild.configuration.welcome.welcomecard.background ? `[<:blurple_link:892441999993618532> ${i18n(guild.preferredLocale, 'VIEWLINK')}](${interaction.guild.configuration.welcome.welcomecard.background})` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:flashlight: ${i18n(guild.preferredLocale, 'OVERLAYOPACITY')}`, interaction.guild.configuration.welcome.welcomecard.overlay.opacity ? `${interaction.guild.configuration.welcome.welcomecard.overlay.opacity}%` : `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:art: ${i18n(guild.preferredLocale, 'OVERLAYCOLOR')}`, interaction.guild.configuration.welcome.welcomecard.overlay.color || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:writing_hand: ${i18n(guild.preferredLocale, 'TITLE')}`, interaction.guild.configuration.welcome.welcomecard.title || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:writing_hand: ${i18n(guild.preferredLocale, 'SUBTITLE')}`, interaction.guild.configuration.welcome.welcomecard.subtitle || `❌ ${i18n(guild.preferredLocale, 'NOTSET')}`, true)
              .setImage('attachment://welcomecard.png')
              .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
              .setTimestamp()

            return interaction.editReply({ embeds: [actualconfig], files: [welcomecard] })
          })
        }

        break
      }

      case 'give': {
        addJoinRole(interaction.guild, interaction.options.getRole('role'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'WELCOME::GIVEROLE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'WELCOME::GIVEROLE:SUCCESS', { ROLE: interaction.options.getRole('role') }))] })
        })
        break
      }

      case 'remove': {
        removeJoinRole(interaction.guild, interaction.options.getRole('role'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(guild.preferredLocale, 'WELCOME::REMOVEROLE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(guild.preferredLocale, 'WELCOME::REMOVEROLE:SUCCESS', { ROLE: interaction.options.getRole('role') }))] })
        })
        break
      }

      case 'list': {
        let { roles } = interaction.guild.configuration.welcome
        roles = roles || []
        roles = roles.map(role => `<@&${role}>`).join(', ')
        interaction.editReply({ embeds: [new MessageEmbed().setColor('#2F3136').setTitle(i18n(guild.preferredLocale, 'WELCOME::LISTROLES:TITLE')).setDescription(roles || i18n(guild.preferredLocale, 'NOSET')).setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()] })
        break
      }

      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(guild.preferredLocale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  },
  runCommand (message) {
    function viewConfigFallback () {
      generateWelcomeCard(message.member, path => {
        const welcomecard = new MessageAttachment(path, 'welcomecard.png')
        const welcomeBasicConfig = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(message.guild.preferredLocale, 'WELCOME::VIEWCONFIG:TITLE'))
          .setDescription(i18n(message.guild.preferredLocale, 'WELCOME::VIEWCONFIG:DESCRIPTION'))
          .addField(`<:blurple_chat:892441341827616859> ${i18n(message.guild.preferredLocale, 'WELCOME::VIEWCONFIG:CHANNEL')}`, `<#${message.guild.configuration.welcome.channel}>` || `❌ ${i18n(message.guild.preferredLocale, 'NOTSET')}`, false)
          .addField(`<:Blurple_Sparkles:938096139327143958> ${i18n(message.guild.preferredLocale, 'WELCOME::VIEWCONFIG:MESSAGE')}`, message.guild.configuration.welcome.message || `❌ ${i18n(message.guild.preferredLocale, 'NOTSET')}`, false)
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        const welcomeCards = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:TITLE'))
          .setDescription(`${i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:ACTUALCONFIG')}`)
          .addField(`:incoming_envelope: ${i18n(message.guild.preferredLocale, 'SENDCARDS')}`, message.guild.configuration.welcome.welcomecard.enabled ? `✅ ${i18n(message.guild.preferredLocale, 'ENABLED')}` : `❌ ${i18n(message.guild.preferredLocale, 'DISABLED')}`, true)
          .addField(`:frame_photo: ${i18n(message.guild.preferredLocale, 'BACKGROUND')}`, message.guild.configuration.welcome.welcomecard.background ? `[<:blurple_link:892441999993618532> ${i18n(message.guild.preferredLocale, 'VIEWLINK')}](${message.guild.configuration.welcome.welcomecard.background})` : `❌ ${i18n(message.guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:flashlight: ${i18n(message.guild.preferredLocale, 'OVERLAYOPACITY')}`, message.guild.configuration.welcome.welcomecard.overlay.opacity ? `${message.guild.configuration.welcome.welcomecard.overlay.opacity}%` : `❌ ${i18n(message.guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:art: ${i18n(message.guild.preferredLocale, 'OVERLAYCOLOR')}`, message.guild.configuration.welcome.welcomecard.overlay.color || `❌ ${i18n(message.guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:writing_hand: ${i18n(message.guild.preferredLocale, 'TITLE')}`, message.guild.configuration.welcome.welcomecard.title || `❌ ${i18n(message.guild.preferredLocale, 'NOTSET')}`, true)
          .addField(`:writing_hand: ${i18n(message.guild.preferredLocale, 'SUBTITLE')}`, message.guild.configuration.welcome.welcomecard.subtitle || `❌ ${i18n(message.guild.preferredLocale, 'NOTSET')}`, true)
          .setImage('attachment://welcomecard.png')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        let { roles } = message.guild.configuration.welcome
        roles = roles || []
        roles = roles.map(role => `<@&${role}>`).join(', ')

        const welcomeRoles = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(message.guild.preferredLocale, 'WELCOME::LISTROLES:TITLE'))
          .setDescription(roles || i18n(message.guild.preferredLocale, 'NOSET'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()

        return message.reply({ embeds: [welcomeBasicConfig, welcomeCards, welcomeRoles], files: [welcomecard] })
      })
    }

    function sendHelp () {
      message.reply({
        embeds: plantillas.ayuda({
          name: 'welcome',
          cooldown: '1',
          module: 'welcome',
          description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:DESCRIPTION'),
          subcommands: [
            { name: 'viewconfig', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:VIEWCONFIG:DESCRIPTION') },
            { name: 'setchannel', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:SETCHANNEL:DESCRIPTION'), parameters: '<#channel>' },
            { name: 'setmessage', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:SETMESSAGE:DESCRIPTION'), parameters: '<message>' },
            { name: 'configurecards viewconfig', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGURECARDS:VIEWCONFIG:DESCRIPTION') },
            { name: 'configurecards sendcards', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGURECARDS:SENDCARDS:DESCRIPTION'), parameters: '<true/false>' },
            { name: 'configurecards backgroundurl', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGURECARDS:BACKGROUNDURL:DESCRIPTION'), parameters: '<url>' },
            { name: 'configurecards overlaycolor', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGURECARDS:OVERLAYCOLOR:DESCRIPTION'), parameters: '<hex color>' },
            { name: 'configurecards overlayopacity', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGURECARDS:OVERLAYOPACITY:DESCRIPTION'), parameters: '<0-100>' },
            { name: 'configurecards title', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGURECARDS:TITLE:DESCRIPTION'), parameters: '<text>' },
            { name: 'configurecards subtitle', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGURECARDS:SUBTITLE:DESCRIPTION'), parameters: '<text>' },
            { name: 'configureroles', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGUREROLE:DESCRIPTION') },
            { name: 'configureroles give', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGUREROLE:GIVE:DESCRIPTION'), parameters: '<role>' },
            { name: 'configureroles remove', description: i18n(message.guild.preferredLocale, 'WELCOME::HELP:CONFIGUREROLE:REMOVE:DESCRIPTION'), parameters: '<role>' }
          ]
        })
      })
    }

    if (!(Object.prototype.hasOwnProperty.call(message.parameters, 0))) return sendHelp()

    switch (message.parameters[0].toLowerCase()) {
      case 'viewconfig': {
        viewConfigFallback()
        break
      }

      case 'setchannel': {
        if (!message.mentions.channels.first()) return sendHelp()

        actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { channel: message.mentions.channel.first().id } }, err => {
          if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::SETCHANNEL:ERROR'))] })
          return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::SETCHANNEL:SUCCESS', { CHANNEL: message.mentions.channel.first() }))] })
        })

        break
      }

      case 'setmessage': {
        if (!(Object.prototype.hasOwnProperty.call(message.parameters, 1))) return sendHelp()

        actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { message: message.parameters.slice(1).join(' ') } }, err => {
          if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::SETMESSAGE:ERROR'))] })
          return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::SETMESSAGE:SUCCESS', { MESSAGE: message.parameters.slice(1).join(' ') }))] })
        })

        break
      }

      case 'configurecards': {
        if (!Object.prototype.hasOwnProperty.call(message.parameters, 2)) return viewConfigFallback()

        switch (message.parameters[1].toLowerCase()) {
          case 'sendcards': {
            if (message.parameters[2] === 'true') {
              actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { welcomecard: { enabled: true } } }, err => {
                if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:SENDCARDS:ERROR'))] })
                return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:SENDCARDS:SUCCESS:ENABLED'))] })
              })
            } else {
              actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { welcomecard: { enabled: false } } }, err => {
                if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:SENDCARDS:ERROR'))] })
                return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:SENDCARDS:SUCCESS:DISABLED'))] })
              })
            }

            break
          }

          case 'backgroundurl': {
            actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { welcomecard: { background: message.parameters.slice(2).join(' ') } } }, err => {
              if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:BACKGROUNDURL:ERROR'))] })
              return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:BACKGROUNDURL:SUCCESS', { BACKGROUND: message.parameters.slice(2).join(' ') }))] })
            })
            break
          }

          case 'overlayopacity': {
            if (parseInt(message.parameters[2], 10) <= 0) {
              message.parameters[2] = '0'
            } else if (parseInt(message.parameters[2], 10) >= 100) {
              message.parameters[2] = '100'
            } else {
              message.parameters[2] = '50'
            }

            actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { welcomecard: { overlay: { opacity: parseInt(message.parameters[2], 10) } } } }, err => {
              if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:OVERLAYOPACITY:ERROR'))] })
              return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:OVERLAYOPACITY:SUCCESS', { OPACITY: message.parameters[2] }))] })
            })
            break
          }

          case 'overlaycolor': {
            if (!hexRegexTester.test(message.parameters[2])) return sendHelp()

            actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { welcomecard: { overlay: { color: message.parameters[2] } } } }, err => {
              if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:OVERLAYCOLOR:ERROR'))] })
              return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:OVERLAYCOLOR:SUCCESS', { COLOR: message.parameters[2] }))] })
            })

            break
          }

          case 'title': {
            actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { welcomecard: { title: message.parameters.slice(2).join(' ') } } }, err => {
              if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:TITLE:ERROR'))] })
              return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:TITLE:SUCCESS', { TITLE: message.parameters.slice(2).join(' ') }))] })
            })
            break
          }

          case 'subtitle': {
            actualizarConfiguracionDelServidor(message.guild, { column: 'welcome', newconfig: { welcomecard: { subtitle: message.parameters.slice(2).join(' ') } } }, err => {
              if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:SUBTITLE:ERROR'))] })
              return message.channel.send({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:SUBTITLE:SUCCESS', { SUBTITLE: message.parameters.slice(2).join(' ') }))] })
            })
            break
          }

          default: {
            viewConfigFallback()
            break
          }
        }

        break
      }

      case 'configureroles': {
        if (!Object.prototype.hasOwnProperty.call(message.parameters, 1)) return viewConfigFallback()

        switch (message.parameters[1].toLowerCase()) {
          case 'give': {
            if (!message.mentions.roles.first()) return viewConfigFallback()

            addJoinRole(message.guild, message.mentions.roles.first(), err => {
              if (err) return message.reply({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::GIVEROLE:ERROR'))] })
              return message.reply({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::GIVEROLE:SUCCESS', { ROLE: message.mentions.roles.first() }))] })
            })

            break
          }

          case 'remove': {
            if (!message.mentions.roles.first()) return viewConfigFallback()

            removeJoinRole(message.guild, message.mentions.roles.first(), err => {
              if (err) return message.reply({ embeds: [plantillas.error(i18n(message.guild.preferredLocale, 'WELCOME::REMOVEROLE:ERROR'))] })
              return message.reply({ embeds: [plantillas.conexito(i18n(message.guild.preferredLocale, 'WELCOME::REMOVEROLE:SUCCESS', { ROLE: message.mentions.roles.first() }))] })
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
