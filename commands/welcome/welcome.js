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
  interaction: new SlashCommandBuilder()
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
  // eslint-disable-next-line complexity
  runInteraction (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setchannel': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'welcome', newconfig: { channel: interaction.options.getChannel('channel').id } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'WELCOME::SETCHANNEL:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'WELCOME::SETCHANNEL:SUCCESS', { CHANNEL: interaction.options.getChannel('channel') }))] })
        })
        break
      }

      case 'setmessage': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'welcome', newconfig: { message: interaction.options.getString('message') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'WELCOME::SETMESSAGE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'WELCOME::SETMESSAGE:SUCCESS', { MESSAGE: interaction.options.getString('message') }))] })
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
            .setTitle(i18n(interaction.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:TITLE'))
            .setDescription(`${i18n(interaction.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:CHANGES')}`)
            .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
            .setTimestamp()

          if (sendcards) {
            modifiedconfig.addField(`:incoming_envelope: ${i18n(interaction.guild.preferredLocale, 'SENDCARDS')}`, sendcards ? `✅ ${i18n(interaction.guild.preferredLocale, 'ENABLED')}` : `❌ ${i18n(interaction.guild.preferredLocale, 'DISABLED')}`, true)
            newconfig.welcomecard.enabled = sendcards
          }

          if (backgroundurl) {
            modifiedconfig.addField(`:frame_photo: ${i18n(interaction.guild.preferredLocale, 'BACKGROUND')}`, backgroundurl ? `[<:blurple_link:892441999993618532> ${i18n(interaction.guild.preferredLocale, 'VIEWLINK')}](${backgroundurl})` : `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.background = backgroundurl
          }

          if (overlayopacity) {
            modifiedconfig.addField(`:flashlight: ${i18n(interaction.guild.preferredLocale, 'OVERLAYOPACITY')}`, overlayopacity ? `${overlayopacity}%` : `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.overlay.opacity = overlayopacity

            if (newconfig.welcomecard.overlay) newconfig.welcomecard.overlay.opacity = overlayopacity
            else newconfig.welcomecard.overlay = { opacity: overlayopacity }
          }

          if (overlaycolor && hexRegexTester.test(overlaycolor)) {
            modifiedconfig.addField(`:art: ${i18n(interaction.guild.preferredLocale, 'OVERLAYCOLOR')}`, overlaycolor || `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)

            if (newconfig.welcomecard.overlay) newconfig.welcomecard.overlay.color = overlaycolor
            else newconfig.welcomecard.overlay = { color: overlaycolor }
          }

          if (title) {
            modifiedconfig.addField(`:writing_hand: ${i18n(interaction.guild.preferredLocale, 'TITLE')}`, title || `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.title = title
          }

          if (subtitle) {
            modifiedconfig.addField(`:writing_hand: ${i18n(interaction.guild.preferredLocale, 'SUBTITLE')}`, subtitle || `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
            newconfig.welcomecard.subtitle = subtitle
          }

          actualizarConfiguracionDelServidor(interaction.guild, { column: 'welcome', newconfig }, err => {
            if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:ERROR'))] })
            return interaction.editReply({ embeds: [modifiedconfig] })
          })
        } else {
          generateWelcomeCard(interaction.member, path => {
            const welcomecard = new MessageAttachment(path, 'welcomecard.png')
            const actualconfig = new MessageEmbed()
              .setColor('#2F3136')
              .setTitle(i18n(interaction.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:TITLE'))
              .setDescription(`${i18n(interaction.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:NOCHANGES')} ${i18n(interaction.guild.preferredLocale, 'WELCOME::CONFIGURECARDS:ACTUALCONFIG')}`)
              .addField(`:incoming_envelope: ${i18n(interaction.guild.preferredLocale, 'SENDCARDS')}`, interaction.guild.configuration.welcome.welcomecard.enabled ? `✅ ${i18n(interaction.guild.preferredLocale, 'ENABLED')}` : `❌ ${i18n(interaction.guild.preferredLocale, 'DISABLED')}`, true)
              .addField(`:frame_photo: ${i18n(interaction.guild.preferredLocale, 'BACKGROUND')}`, interaction.guild.configuration.welcome.welcomecard.background ? `[<:blurple_link:892441999993618532> ${i18n(interaction.guild.preferredLocale, 'VIEWLINK')}](${interaction.guild.configuration.welcome.welcomecard.background})` : `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:flashlight: ${i18n(interaction.guild.preferredLocale, 'OVERLAYOPACITY')}`, interaction.guild.configuration.welcome.welcomecard.overlay.opacity ? `${interaction.guild.configuration.welcome.welcomecard.overlay.opacity}%` : `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:art: ${i18n(interaction.guild.preferredLocale, 'OVERLAYCOLOR')}`, interaction.guild.configuration.welcome.welcomecard.overlay.color || `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:writing_hand: ${i18n(interaction.guild.preferredLocale, 'TITLE')}`, interaction.guild.configuration.welcome.welcomecard.title || `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
              .addField(`:writing_hand: ${i18n(interaction.guild.preferredLocale, 'SUBTITLE')}`, interaction.guild.configuration.welcome.welcomecard.subtitle || `❌ ${i18n(interaction.guild.preferredLocale, 'NOTSET')}`, true)
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
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'WELCOME::GIVEROLE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredLocale, 'WELCOME::GIVEROLE:SUCCESS', { ROLE: interaction.options.getRole('role') }))] })
        })
        break
      }

      case 'remove': {
        removeJoinRole(interaction.guild, interaction.options.getRole('role'), err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'WELCOME::REMOVEROLE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredLocale, 'WELCOME::REMOVEROLE:SUCCESS', { ROLE: interaction.options.getRole('role') }))] })
        })
        break
      }

      case 'list': {
        let { roles } = interaction.guild.configuration.welcome
        roles = roles || []
        roles = roles.map(role => `<@&${role}>`).join(', ')
        interaction.editReply({ embeds: [new MessageEmbed().setColor('#2F3136').setTitle(i18n(interaction.guild.preferredLocale, 'WELCOME::LISTROLES:TITLE')).setDescription(roles || i18n(interaction.guild.preferredLocale, 'NOSET')).setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() }).setTimestamp()] })
        break
      }

      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(interaction.guild.preferredLocale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  }
}