const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions, MessageEmbed } = require('discord.js')
const { subirInteraccionesDelServidor, actualizarConfiguracionDelServidor } = require('../../core/guildManager')
const { plantillas } = require('../../core/messageManager')
const { modulosDisponibles } = require('../../core/moduleManager')

const i18n = require('../../core/i18nManager')
const Consolex = require('../../core/consolex')
const avaliableModules = []

modulosDisponibles.forEach(modulo => avaliableModules.push({ name: modulo, value: modulo }))

module.exports = {
  name: 'bot',
  description: 'BOT::HELP:DESCRIPTION',
  cooldown: 1000,
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: true,
  interaction: new SlashCommandBuilder()
    .addSubcommandGroup(scg => scg
      .setName('modules')
      .setDescription('📦 Manage the modules of your server')
      .addSubcommand(sc => sc.setName('enable')
        .setDescription('Enable a module.')
        .addStringOption(input => input.setName('module').setRequired(true).setDescription('The name of the module.').addChoices(avaliableModules)))
      .addSubcommand(sc => sc.setName('disable')
        .setDescription('Disable a module.')
        .addStringOption(input => input.setName('module').setRequired(true).setDescription('The name of the module.').addChoices(avaliableModules)))
      .addSubcommand(sc => sc.setName('viewconfig').setDescription('View the status of the modules of your server.'))
    )
    .addSubcommand(sc => sc.setName('setprefix').setDescription('Set the prefix of your server.').addStringOption(input => input.setName('newprefix').setDescription('The new prefix of the bot.').setRequired(true)))
    .addSubcommandGroup(scg => scg
      .setName('interactions')
      .setDescription('💬 Manage the interactions of your server')
      .addSubcommand(sc => sc.setName('update').setDescription('Update the interactions of your server.').addBooleanOption(input => input.setName('configinteractions').setDescription('Deploy the configuration interactions?')))),
  runInteraction (interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setprefix': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'common', newconfig: { prefix: interaction.options.getString('newprefix') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'BOT::SETPREFIX:ERROR'))] })

          try {
            interaction.guild.members.cache.get(process.Client.user.id).setNickname(`[${interaction.options.getString('newprefix')}] ${process.Client.user.username}`)
          } catch (err2) {
            Consolex.gestionarError(err2)
          }

          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredlocale, 'BOT::SETPREFIX:SUCCESS', { PREFIX: interaction.options.getString('newprefix') }))] })
        })
        break
      }

      case 'showinteractions': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'interactions', newconfig: { showinteractions: true } }, err => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredlocale, 'BOT-SHOWINTERACTIONS:ERROR'))] })
          else interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredlocale, 'BOT-SHOWINTERACTIONS:SUCCESS'))] })
        })
        break
      }

      case 'enforceusage': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'interactions', newconfig: { enforceusage: true } }, err => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredlocale, 'BOT-ENFORCEUSAGE:ERROR'))] })
          else interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredlocale, 'BOT-ENFORCEUSAGE:SUCCESS'))] })
        })
        break
      }

      case 'showcfginteractions': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'interactions', newconfig: { showcfginteractions: true } }, err => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredlocale, 'BOT-SHOWCFGINTERACTIONS:ERROR'))] })
          else interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredlocale, 'BOT-SHOWCFGINTERACTIONS:SUCCESS'))] })
        })
        break
      }

      case 'setlanguage': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'common', newconfig: { language: interaction.options.getString('language') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.options.getString('language'), 'BOT::SETLANGUAGE:ERROR'))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.options.getString('language'), 'BOT::SETLANGUAGE:SUCCESS', { LANGUAGE: interaction.options.getString('language') }))] })
        })
        break
      }

      case 'viewconfig': {
        const botConfigEmbed = new MessageEmbed()
          .setColor('#2F3136')
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
          .setTimestamp()
          .setTitle(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:TITLE'))
          .setDescription(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:DESCRIPTION'))
          .addField(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:CUSTOMCOMMANDS'), interaction.guild.configuration.customcommands.enabled ? i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:FAREWELL'), interaction.guild.configuration.farewell.enabled ? i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:LEVELING'), interaction.guild.configuration.leveling.enabled ? i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:SUGGESTIONS'), interaction.guild.configuration.suggestions.enabled ? i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:AUTOREPLY'), interaction.guild.configuration.autoreplies.enabled ? i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:WELCOME'), interaction.guild.configuration.welcome.enabled ? i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(interaction.guild.preferredLocale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)

        interaction.editReply({ embeds: [botConfigEmbed] })
        break
      }

      case 'update': {
        try {
          subirInteraccionesDelServidor(interaction.guild, interaction.options.getBoolean('configinteractions'), err => {
            if (err) {
              interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'UPDATE::ERROR'))] })
              throw err
            }

            return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredlocale, 'UPDATE::SUCCESS'))] })
          })
        } catch (err) {
          Consolex.gestionarError(err)
        }

        break
      }

      case 'enable': {
        const moduleToEnable = interaction.options.getString('module')

        actualizarConfiguracionDelServidor(interaction.guild, { column: moduleToEnable, newconfig: { enabled: true } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:ENABLE:ERROR', { MODULE: moduleToEnable }))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:ENABLE:SUCCESS', { MODULE: moduleToEnable }))] })
        })

        break
      }

      case 'disable': {
        const moduleToDisable = interaction.options.getString('module')

        actualizarConfiguracionDelServidor(interaction.guild, { column: moduleToDisable, newconfig: { enabled: false } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:DISABLE:ERROR', { MODULE: moduleToDisable }))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(interaction.guild.preferredLocale, 'BOT::MODULES:DISABLE:SUCCESS', { MODULE: moduleToDisable }))] })
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
