const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions, MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { subirInteraccionesDelServidor, actualizarConfiguracionDelServidor } = require('../../functions/guildManager')
const { plantillas } = require('../../functions/messageManager')
const Consolex = require('../../functions/consolex')

const avaliableLanguages = ['en', 'es']
const avaliableModules = ['suggestions', 'farewell', 'welcome', 'autoreplies', 'customcommands', 'leveling', 'mcsrvstatus']

module.exports = {
  name: 'bot',
  description: '🤖 Manage the bot configuration of your server',
  cooldown: 1000,
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: true,
  interactionData: new SlashCommandBuilder()
    .addSubcommandGroup(scg => scg
      .setName('modules')
      .setDescription('📦 Manage the modules of your server')
      .addSubcommand(sc => sc.setName('enable')
        .setDescription('Enable a module.')
        .addStringOption(input => input.setName('module').setRequired(true).setDescription('The name of the module.').addChoices({ name: 'customcommands', value: 'customcommands' }, { name: 'farewell', value: 'farewell' }, { name: 'leveling', value: 'leveling' }, { name: 'welcome', value: 'welcome' }, { name: 'suggestions', value: 'suggestions' }, { name: 'autoreplies', value: 'autoreplies' }, { name: 'mcsrvstatus', value: 'mcsrvstatus' })))
      .addSubcommand(sc => sc.setName('disable')
        .setDescription('Disable a module.')
        .addStringOption(input => input.setName('module').setRequired(true).setDescription('The name of the module.').addChoices({ name: 'customcommands', value: 'customcommands' }, { name: 'farewell', value: 'farewell' }, { name: 'leveling', value: 'leveling' }, { name: 'welcome', value: 'welcome' }, { name: 'suggestions', value: 'suggestions' }, { name: 'autoreplies', value: 'autoreplies' }, { name: 'mcsrvstatus', value: 'mcsrvstatus' })))
      .addSubcommand(sc => sc.setName('viewconfig').setDescription('View the status of the modules of your server.'))
    )
    .addSubcommand(sc => sc.setName('setprefix').setDescription('Set the prefix of your server.').addStringOption(input => input.setName('newprefix').setDescription('The new prefix of the bot.').setRequired(true)))
    .addSubcommandGroup(scg => scg
      .setName('interactions')
      .setDescription('💬 Manage the interactions of your server')
      .addSubcommand(sc => sc.setName('update').setDescription('Update the interactions of your server.'))
      .addSubcommand(sc => sc.setName('showinteractions').setDescription('Show the interactions of the bot in your server.').addBooleanOption(input => input.setName('showall').setDescription('Show all the interactions of the bot.')))
      .addSubcommand(sc => sc.setName('enforceusage').setDescription('Enforce the usage of the interactions of your server. This will disable traditional commands.').addBooleanOption(input => input.setName('enforce').setDescription('Enforce the usage of the interactions of your server.')))
      .addSubcommand(sc => sc.setName('showcfginteractions').setDescription('Show the config interactions of the bot in your server.').addBooleanOption(input => input.setName('showall').setDescription('Show all the config interactions of the bot.')))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setprefix': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'common', newconfig: { prefix: interaction.options.getString('newprefix') } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'BOT::SETPREFIX:ERROR'))] })

          try {
            interaction.guild.members.cache.get(process.Client.user.id).setNickname(`[${interaction.options.getString('newprefix')}] ${process.Client.user.username}`)
          } catch (err2) {
            Consolex.gestionarError(err2)
          }

          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'BOT::SETPREFIX:SUCCESS', { PREFIX: interaction.options.getString('newprefix') }))] })
        })
        break
      }

      case 'showinteractions': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'interactions', newconfig: { showinteractions: true } }, err => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'BOT-SHOWINTERACTIONS:ERROR'))] })
          else interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'BOT-SHOWINTERACTIONS:SUCCESS'))] })
        })
        break
      }

      case 'enforceusage': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'interactions', newconfig: { enforceusage: true } }, err => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'BOT-ENFORCEUSAGE:ERROR'))] })
          else interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'BOT-ENFORCEUSAGE:SUCCESS'))] })
        })
        break
      }

      case 'showcfginteractions': {
        actualizarConfiguracionDelServidor(interaction.guild, { column: 'interactions', newconfig: { showcfginteractions: true } }, err => {
          if (err) interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'BOT-SHOWCFGINTERACTIONS:ERROR'))] })
          else interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'BOT-SHOWCFGINTERACTIONS:SUCCESS'))] })
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
          .setTitle(i18n(locale, 'BOT::MODULES:VIEWCONFIG:TITLE'))
          .setDescription(i18n(locale, 'BOT::MODULES:VIEWCONFIG:DESCRIPTION'))
          .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:CUSTOMCOMMANDS'), interaction.guild.configuration.customcommands.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:FAREWELL'), interaction.guild.configuration.farewell.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:LEVELING'), interaction.guild.configuration.leveling.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:SUGGESTIONS'), interaction.guild.configuration.suggestions.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:AUTOREPLY'), interaction.guild.configuration.autoreplies.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
          .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:WELCOME'), interaction.guild.configuration.welcome.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)

        interaction.editReply({ embeds: [botConfigEmbed] })
        break
      }

      case 'update': {
        try {
          subirInteraccionesDelServidor(interaction.guild, interaction.options.getBoolean('configinteractions'), err => {
            if (err) {
              interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'UPDATE::ERROR'))] })
              throw err
            }

            return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'UPDATE::SUCCESS'))] })
          })
        } catch (err) {
          Consolex.gestionarError(err)
        }

        break
      }

      case 'enable': {
        const moduleToEnable = interaction.options.getString('module')

        actualizarConfiguracionDelServidor(interaction.guild, { column: moduleToEnable, newconfig: { enabled: true } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'BOT::MODULES:ENABLE:ERROR', { MODULE: moduleToEnable }))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'BOT::MODULES:ENABLE:SUCCESS', { MODULE: moduleToEnable }))] })
        })

        break
      }

      case 'disable': {
        const moduleToDisable = interaction.options.getString('module')

        actualizarConfiguracionDelServidor(interaction.guild, { column: moduleToDisable, newconfig: { enabled: false } }, err => {
          if (err) return interaction.editReply({ embeds: [plantillas.error(i18n(locale, 'BOT::MODULES:DISABLE:ERROR', { MODULE: moduleToDisable }))] })
          return interaction.editReply({ embeds: [plantillas.conexito(i18n(locale, 'BOT::MODULES:DISABLE:SUCCESS', { MODULE: moduleToDisable }))] })
        })

        break
      }

      default: {
        interaction.editReply({ embeds: [plantillas.informacion(i18n(locale, 'INTERACTIONS::NOT_UPDATED'))] })
        break
      }
    }
  },
  runCommand (locale, message) {
    function sendHelp () {
      message.reply({
        embeds: plantillas.ayuda({
          name: 'bot',
          description: i18n(locale, 'BOT::HELP:DESCRIPTION'),
          subcommands: [
            { name: 'updateinteractions', description: i18n(locale, 'BOT::HELP:UPDATEINTERACTIONS:DESCRIPTION'), parameters: '<configinteractions[true/false]>' },
            { name: 'setprefix', description: i18n(locale, 'BOT::HELP:SETPREFIX:DESCRIPTION'), parameters: '<prefix>' },
            { name: 'setlanguage', description: i18n(locale, 'BOT::HELP:SETLANGUAGE:DESCRIPTION'), parameters: '<language[en/es]>' },
            { name: 'modules viewconfig', description: i18n(locale, 'BOT::HELP:MODULESVIEWCONFIG:DESCRIPTION') },
            { name: 'modules enable', description: i18n(locale, 'BOT::HELP:MODULESENABLE:DESCRIPTION'), parameters: '<module>' },
            { name: 'modules disable', description: i18n(locale, 'BOT::HELP:MODULESDISABLE:DESCRIPTION'), parameters: '<module>' }
          ]
        })
      })
    }

    if (!Object.prototype.hasOwnProperty.call(message.parameters, 0)) return sendHelp()

    switch (message.parameters[0]) {
      case 'setprefix': {
        if (!Object.prototype.hasOwnProperty.call(message.parameters, 1)) return sendHelp()

        actualizarConfiguracionDelServidor(message.guild, { column: 'common', newconfig: { prefix: message.parameters[1] } }, err => {
          if (err) return message.channel.send({ embeds: [plantillas.error(i18n(locale, 'BOT::SETPREFIX:ERROR'))] })

          try {
            message.guild.members.cache.get(process.Client.user.id).setNickname(`[${message.parameters[1]}] ${process.Client.user.username}`)
          } catch (err2) {
            Consolex.gestionarError(err2)
          }

          return message.channel.send({ embeds: [plantillas.conexito(i18n(locale, 'BOT::SETPREFIX:SUCCESS', { PREFIX: message.parameters[1] }))] })
        })

        break
      }

      case 'setlanguage': {
        if (!(Object.prototype.hasOwnProperty.call(message.parameters, 1) && avaliableLanguages.includes(message.parameters[1]))) return sendHelp()

        actualizarConfiguracionDelServidor(message.guild, { column: 'common', newconfig: { language: message.parameters[1] } }, err => {
          if (err) return message.channel.send({ embeds: [plantillas.error(i18n(message.parameters[1], 'BOT::SETLANGUAGE:ERROR'))] })
          return message.channel.send({ embeds: [plantillas.conexito(i18n(message.parameters[1], 'BOT::SETLANGUAGE:SUCCESS', { LANGUAGE: message.parameters[1] }))] })
        })

        break
      }

      case 'updateinteractions': {
        try {
          subirInteraccionesDelServidor(message.guild, err => {
            if (err) {
              message.reply({ embeds: [plantillas.error(i18n(locale, 'UPDATE::ERROR'))] })
              throw err
            }

            return message.reply({ embeds: [plantillas.conexito(i18n(locale, 'UPDATE::SUCCESS'))] })
          })
        } catch (err) {
          Consolex.gestionarError(err)
        }

        break
      }

      case 'modules': {
        if (!Object.prototype.hasOwnProperty.call(message.parameters, 1)) return sendHelp()

        switch (message.parameters[1]) {
          case 'viewconfig': {
            const botConfigEmbed = new MessageEmbed()
              .setColor('#2F3136')
              .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
              .setTimestamp()
              .setTitle(i18n(locale, 'BOT::MODULES:VIEWCONFIG:TITLE'))
              .setDescription(i18n(locale, 'BOT::MODULES:VIEWCONFIG:DESCRIPTION'))
              .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:CUSTOMCOMMANDS'), message.guild.configuration.customcommands.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
              .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:FAREWELL'), message.guild.configuration.farewell.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
              .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:LEVELING'), message.guild.configuration.leveling.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
              .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:SUGGESTIONS'), message.guild.configuration.suggestions.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
              .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:AUTOREPLY'), message.guild.configuration.autoreplies.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)
              .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:WELCOME'), message.guild.configuration.welcome.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)

            message.reply({ embeds: [botConfigEmbed] })
            break
          }

          case 'enable': {
            if (!(Object.prototype.hasOwnProperty.call(message.parameters, 2) && avaliableModules.includes(message.parameters[2]))) return sendHelp()

            actualizarConfiguracionDelServidor(message.guild, { column: message.parameters[2], newconfig: { enabled: true } }, err => {
              if (err) return message.reply({ embeds: [plantillas.error(i18n(locale, 'BOT::MODULES:ENABLE:ERROR', { MODULE: message.parameters[2] }))] })
              return message.reply({ embeds: [plantillas.conexito(i18n(locale, 'BOT::MODULES:ENABLE:SUCCESS', { MODULE: message.parameters[2] }))] })
            })

            break
          }

          case 'disable': {
            if (!(Object.prototype.hasOwnProperty.call(message.parameters, 2) && avaliableModules.includes(message.parameters[2]))) return sendHelp()

            actualizarConfiguracionDelServidor(message.guild, { column: message.parameters[2], newconfig: { enabled: false } }, err => {
              if (err) return message.reply({ embeds: [plantillas.error(i18n(locale, 'BOT::MODULES:DISABLE:ERROR', { MODULE: message.parameters[2] }))] })

              return message.reply({ embeds: [plantillas.conexito(i18n(locale, 'BOT::MODULES:DISABLE:SUCCESS', { MODULE: message.parameters[2] }))] })
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
