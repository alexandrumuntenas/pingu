/* eslint-disable max-depth */
/* eslint-disable complexity */
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions, MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { deployGuildInteractions, updateGuildConfigNext } = require('../../functions/guildDataManager')
const { success, error, help } = require('../../functions/defaultMessages')
const Consolex = require('../../functions/consolex')

const avaliableLanguages = ['en', 'es']
const avaliableModules = ['suggestions', 'farewell', 'welcome', 'autoreplies', 'customcommands', 'leveling']

module.exports = {
  name: 'bot',
  description: '🤖 Manage the bot configuration of your server',
  cooldown: 5,
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  isConfigurationCommand: false,
  interactionData: new SlashCommandBuilder()
    .addSubcommandGroup(scg => scg
      .setName('modules')
      .setDescription('📦 Manage the modules of your server')
      .addSubcommand(sc => sc.setName('enable')
        .setDescription('Enable a module.')
        .addStringOption(input => input.setName('module')
          .setRequired(true).setDescription('The name of the module.')
          .addChoice('customcommands', 'customcommands')
          .addChoice('farewell', 'farewell')
          .addChoice('leveling', 'leveling')
          .addChoice('welcome', 'welcome')
          .addChoice('suggestions', 'suggestions')
        ))
      .addSubcommand(sc => sc.setName('disable')
        .setDescription('Disable a module.')
        .addStringOption(input => input.setName('module')
          .setRequired(true).setDescription('The name of the module.')
          .addChoice('customcommands', 'customcommands')
          .addChoice('farewell', 'farewell')
          .addChoice('leveling', 'leveling')
          .addChoice('welcome', 'welcome')
          .addChoice('suggestions', 'suggestions')
        ))
      .addSubcommand(sc => sc.setName('viewconfig').setDescription('View the status of the modules of your server.'))
    )
    .addSubcommand(sc => sc.setName('setprefix').setDescription('Set the prefix of your server.').addStringOption(input => input.setName('newprefix').setDescription('The new prefix of the bot.').setRequired(true)))
    .addSubcommand(sc => sc.setName('setlanguage').setDescription('Set the language of your server.')
      .addStringOption(input => input.setName('language').setDescription('The new language of the bot.').setRequired(true)
        .addChoice('English', 'en')
        .addChoice('Español', 'es')
        .addChoice('Français (Not avaliable)', 'es')
        .addChoice('Italiano (Not avaliable)', 'es')
        .addChoice('Deutsch (Not avaliable)', 'es')
        .addChoice('Português (Not avaliable)', 'es')
        .addChoice('Nederlands (Not avaliable)', 'es')
        .addChoice('Română (Not avaliable)', 'es'))
    )
    .addSubcommandGroup(scg => scg
      .setName('interactions')
      .setDescription('💬 Manage the interactions of your server')
      .addSubcommand(sc => sc.setName('update').setDescription('Update the interactions of your server.').addBooleanOption(input => input.setName('configinteractions').setDescription('Deploy the configuration interactions?')))),
  runInteraction (locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'setprefix': {
        updateGuildConfigNext(interaction.guild, { column: 'common', newconfig: { prefix: interaction.options.getString('newprefix') } }, err => {
          if (err) {
            return interaction.editReply({ embeds: [error(i18n(locale, 'BOT::SETPREFIX:ERROR'))] })
          }

          try {
            interaction.guild.members.cache.get(process.Client.user.id).setNickname(`[${interaction.options.getString('newprefix')}] ${process.Client.user.username}`)
          } catch (err2) {
            Consolex.handleError(err2)
          }

          return interaction.editReply({ embeds: [success(i18n(locale, 'BOT::SETPREFIX:SUCCESS', { PREFIX: interaction.options.getString('newprefix') }))] })
        })
        break
      }

      case 'setlanguage': {
        updateGuildConfigNext(interaction.guild, { column: 'common', newconfig: { language: interaction.options.getString('language') } }, err => {
          if (err) {
            return interaction.editReply({ embeds: [error(i18n(interaction.options.getString('language'), 'BOT::SETLANGUAGE:ERROR'))] })
          }

          return interaction.editReply({ embeds: [success(i18n(interaction.options.getString('language'), 'BOT::SETLANGUAGE:SUCCESS', { LANGUAGE: interaction.options.getString('language') }))] })
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
          .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:WELCOME'), interaction.guild.configuration.welcome.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)

        interaction.editReply({ embeds: [botConfigEmbed] })
        break
      }

      case 'update': {
        try {
          deployGuildInteractions(interaction.guild, interaction.options.getBoolean('configinteractions'), err => {
            if (err) {
              interaction.editReply({ embeds: [error(i18n(locale, 'UPDATE::ERROR'))] })
              throw err
            }

            updateGuildConfigNext(interaction.guild, { column: 'common', newconfig: { interactions: { enabled: interaction.options.getBoolean('configinteractions') } } })

            return interaction.editReply({ embeds: [success(i18n(locale, 'UPDATE::SUCCESS'))] })
          })
        } catch (err) {
          Consolex.handleError(err)
        }

        break
      }

      case 'enable': {
        const moduleToEnable = interaction.options.getString('module')

        updateGuildConfigNext(interaction.guild, { column: moduleToEnable, newconfig: { enabled: true } }, err => {
          if (err) {
            return interaction.editReply({ embeds: [error(i18n(locale, 'BOT::MODULES:ENABLE:ERROR', { MODULE: moduleToEnable }))] })
          }

          return interaction.editReply({ embeds: [success(i18n(locale, 'BOT::MODULES:ENABLE:SUCCESS', { MODULE: moduleToEnable }))] })
        })

        break
      }

      case 'disable': {
        const moduleToDisable = interaction.options.getString('module')

        updateGuildConfigNext(interaction.guild, { column: moduleToDisable, newconfig: { enabled: false } }, err => {
          if (err) {
            return interaction.editReply({ embeds: [error(i18n(locale, 'BOT::MODULES:DISABLE:ERROR', { MODULE: moduleToDisable }))] })
          }

          return interaction.editReply({ embeds: [success(i18n(locale, 'BOT::MODULES:DISABLE:SUCCESS', { MODULE: moduleToDisable }))] })
        })

        break
      }

      default: {
        break
      }
    }
  },
  runCommand (locale, message) {
    // Distrubición de los subcomandos: updateinteractions, modules viewconfig, setprefix, modules disable, setlanguage, modules enable, modules viewconfig

    function sendHelp () {
      message.reply({
        embeds: help({
          name: 'bot',
          description: i18n(locale, 'BOT::HELP:DESCRIPTION'),
          subcommands: [
            {
              name: 'updateinteractions',
              description: i18n(locale, 'BOT::HELP:UPDATEINTERACTIONS:DESCRIPTION'),
              parameters: '<configinteractions[true/false]>'
            },
            {
              name: 'setprefix',
              description: i18n(locale, 'BOT::HELP:SETPREFIX:DESCRIPTION'),
              parameters: '<prefix>'
            },
            {
              name: 'setlanguage',
              description: i18n(locale, 'BOT::HELP:SETLANGUAGE:DESCRIPTION'),
              parameters: '<language[en/es]>'
            },
            {
              name: 'modules viewconfig',
              description: i18n(locale, 'BOT::HELP:MODULESVIEWCONFIG:DESCRIPTION')
            },
            {
              name: 'modules enable',
              description: i18n(locale, 'BOT::HELP:MODULESENABLE:DESCRIPTION'),
              parameters: '<module>'
            },
            {
              name: 'modules disable',
              description: i18n(locale, 'BOT::HELP:MODULESDISABLE:DESCRIPTION'),
              parameters: '<module>'
            }
          ]
        })
      })
    }

    if (Object.prototype.hasOwnProperty.call(message.parameters, 0)) {
      switch (message.parameters[0]) {
        case 'setprefix': {
          if (Object.prototype.hasOwnProperty.call(message.parameters, 1)) {
            const prefix = message.parameters[1]

            updateGuildConfigNext(message.guild, { column: 'common', newconfig: { prefix } }, err => {
              if (err) {
                return message.channel.send({ embeds: [error(i18n(locale, 'BOT::SETPREFIX:ERROR'))] })
              }

              try {
                message.guild.members.cache.get(process.Client.user.id).setNickname(`[${prefix}] ${process.Client.user.username}`)
              } catch (err2) {
                Consolex.handleError(err2)
              }

              return message.channel.send({ embeds: [success(i18n(locale, 'BOT::SETPREFIX:SUCCESS', { PREFIX: prefix }))] })
            })
          } else {
            sendHelp()
          }

          break
        }

        case 'setlanguage': {
          if (Object.prototype.hasOwnProperty.call(message.parameters, 1) && avaliableLanguages.includes(message.parameters[1])) {
            updateGuildConfigNext(message.guild, { column: 'common', newconfig: { language: message.parameters[1] } }, err => {
              if (err) {
                return message.channel.send({ embeds: [error(i18n(message.parameters[1], 'BOT::SETLANGUAGE:ERROR'))] })
              }

              return message.channel.send({ embeds: [success(i18n(message.parameters[1], 'BOT::SETLANGUAGE:SUCCESS', { LANGUAGE: message.parameters[1] }))] })
            })
          } else {
            sendHelp()
          }

          break
        }

        case 'updateinteractions': {
          if (Object.prototype.hasOwnProperty.call(message.parameters, 1)) {
            if (message.parameters[1] === 'true') {
              message.parameters[1] = true
            } else {
              message.parameters[1] = false
            }
          }

          updateGuildConfigNext(message.guild, { column: 'common', newconfig: { interactions: { enabled: message.parameters[1] } } })

          try {
            deployGuildInteractions(message.guild, message.parameters[1], err => {
              if (err) {
                message.reply({ embeds: [error(i18n(locale, 'UPDATE::ERROR'))] })
                throw err
              }

              return message.reply({ embeds: [success(i18n(locale, 'UPDATE::SUCCESS'))] })
            })
          } catch (err) {
            Consolex.handleError(err)
          }

          break
        }

        case 'modules': {
          if (Object.prototype.hasOwnProperty.call(message.parameters, 1)) {
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
                  .addField(i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:WELCOME'), message.guild.configuration.welcome.enabled ? i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:ENABLED') : i18n(locale, 'BOT::MODULES:VIEWCONFIG:FIELD:DISABLED'), true)

                message.reply({ embeds: [botConfigEmbed] })
                break
              }

              case 'enable': {
                if (Object.prototype.hasOwnProperty.call(message.parameters, 2) && avaliableModules.includes(message.parameters[2])) {
                  updateGuildConfigNext(message.guild, { column: message.parameters[2], newconfig: { enabled: true } }, err => {
                    if (err) {
                      return message.reply({ embeds: [error(i18n(locale, 'BOT::MODULES:ENABLE:ERROR', { MODULE: message.parameters[2] }))] })
                    }

                    return message.reply({ embeds: [success(i18n(locale, 'BOT::MODULES:ENABLE:SUCCESS', { MODULE: message.parameters[2] }))] })
                  })
                } else {
                  sendHelp()
                }

                break
              }

              case 'disable': {
                if (Object.prototype.hasOwnProperty.call(message.parameters, 2) && avaliableModules.includes(message.parameters[2])) {
                  updateGuildConfigNext(message.guild, { column: message.parameters[2], newconfig: { enabled: false } }, err => {
                    if (err) {
                      return message.reply({ embeds: [error(i18n(locale, 'BOT::MODULES:DISABLE:ERROR', { MODULE: message.parameters[2] }))] })
                    }

                    return message.reply({ embeds: [success(i18n(locale, 'BOT::MODULES:DISABLE:SUCCESS', { MODULE: message.parameters[2] }))] })
                  })
                } else {
                  sendHelp()
                }

                break
              }

              default: {
                sendHelp()
                break
              }
            }
          } else {
            sendHelp()
          }

          break
        }

        default: {
          sendHelp()
          break
        }
      }
    } else {
      sendHelp()
    }
  }
}
