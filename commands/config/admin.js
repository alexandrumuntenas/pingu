const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Error, Info, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

const columnRelationShip = {
  welcome: 'welcomeEnabled',
  farewell: 'farewellEnabled',
  joinroles: 'joinRolesEnabled',
  levels: 'levelsEnabled',
  economy: 'economyEnabled',
  autoresponder: 'autoresponderEnabled',
  suggestions: 'suggestionsEnabled',
  customcommands: 'customcommandsEnabled'
}

module.exports = {
  name: 'admin',
  description: 'Master command to manage the bot.',
  alias: [''],
  permissions: [],
  interactionData: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Master command to manage the bot.')
    .addSubcommand(sc => sc.setName('viewcnfcommands').setDescription('Enables or disables the deployment of bot configuration commands.').addBooleanOption(bo => bo.setName('view').setDescription('Do you want the configuration commands to be deployed to your server?').setRequired(true)))
    .addSubcommand(sc => sc.setName('setprefix').setDescription('Set the prefix for the bot').addStringOption(option => option.setName('newprefix').setDescription('Enter the new prefix').setRequired(true)))
    .addSubcommand(sc => sc.setName('setlanguage').setDescription('Set the language for the bot').addStringOption(option => option.setName('language').setDescription('The language to set').setRequired(true).addChoice('Spanish', 'es').addChoice('English', 'en').setRequired(true)))
    .addSubcommandGroup(scg => scg.setName('modules').setDescription('Manage the modules of the bot.').addSubcommand(sc => sc.setName('viewconfig').setDescription('Checks the status of the modules')).addSubcommand(sc => sc.setName('enable').setDescription('Enable a module').addStringOption(so => so.setName('module').setDescription('The name of the module to enable.').addChoice('Autoresponder', 'autoresponder').addChoice('Welcomer', 'welcomer').addChoice('Join Roles', 'joinroles').addChoice('Farewell', 'farewell').addChoice('Leveling', 'leveling').addChoice('Custom Commands', 'customcommands').addChoice('Economy', 'economy').addChoice('Suggestions', 'suggestions').setRequired(true))).addSubcommand(sc => sc.setName('disable').setDescription('Disable a module').addStringOption(so => so.setName('module').setDescription('The name of the module to disable.').addChoice('Autoresponder', 'autoresponder').addChoice('Welcomer', 'welcomer').addChoice('Join Roles', 'joinroles').addChoice('Farewell', 'farewell').addChoice('Leveling', 'leveling').addChoice('Custom Commands', 'customcommands').addChoice('Economy', 'economy').addChoice('Suggestions', 'suggestions').setRequired(true)))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'viewcnfcommands': {
        const view = interaction.options.getBoolean('view')

        if (view) {
          client.pool.query('UPDATE `guildData` SET `guildViewCnfCmdsEnabled` = 1 WHERE guild = ?', [interaction.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:SUCCESS'))] })
          })
        } else {
          client.pool.query('UPDATE `guildData` SET `guildViewCnfCmdsEnabled` = 0 WHERE guild = ?', [interaction.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:DISABLE:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:DISABLE:SUCCESS'))] })
          })
        }

        client.commands.get('update').executeInteraction(client, locale, interaction)

        break
      }
      case 'viewconfig': {
        interaction.editReply({ embeds: [Info('This option is still under development. It will be implemented when the overhaul of the translation files is completed.')] })
        break
      }
      case 'enable': {
        const module = interaction.options.getString('module')
        client.pool.query('UPDATE `guildData` SET ?? = 1 WHERE `guild` = ?', [columnRelationShip[module], interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEENABLE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::MODULEENABLE:SUCCESS', { MODULE: module }))] })
        })
        break
      }
      case 'disable': {
        const module = interaction.options.getString('module')
        client.pool.query('UPDATE `guildData` SET ?? = 0 WHERE `guild` = ?', [columnRelationShip[module], interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEDISABLE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::MODULEDISABLE:SUCCESS', { MODULE: module }))] })
        })
        break
      }
      case 'setprefix': {
        client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [interaction.options.getString('newprefix'), interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::SETPREFIX:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::SETPREFIX:SUCCESS', { guildPrefix: interaction.options.getString('newprefix') }))] })
        })
        break
      }
      case 'setlanguage': {
        client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [interaction.options.getString('language'), interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::SETLANGUAGE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::SETLANGUAGE:SUCCESS', { guildLanguage: interaction.options.getString('language') }))] })
        })
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const help = Help('admin', 'Master command to manage the bot', [{ option: 'viewcnfcommands', description: i18n.help(locale, 'ADMIN::OPTION:VIEWCNFCOMMANDS'), syntax: 'viewcnfcommands <true/false>' }, { option: 'modules viewconfig', description: i18n.help(locale, 'ADMIN::OPTION:MODULES_VIEWCONFIG'), syntax: 'modules viewconfig' }, { option: 'modules enable', description: i18n.help(locale, 'ADMIN::OPTION:MODULES_ENABLE'), syntax: 'modules enable <module>' }, { option: 'modules disable', description: i18n.help(locale, 'ADMIN::OPTION:MODULE_DISABLE'), syntax: 'modules disable <module>' }, { option: 'setprefix', description: i18n.help(locale, 'SETPREFIX::OPTION:NEWPREFIX'), syntax: 'setprefix <new prefix>' }, { option: 'setlanguage', description: i18n.help(locale, 'SETLANGUAGE::DESCRIPTION'), syntax: 'setlanguage <en/es>' }])
    if (message.args && Object.prototype.hasOwnProperty.call(message.args, '0')) {
      switch (message.args[0]) {
        case 'viewcnfcommands': {
          if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
            if (message.args[1] === 'true') {
              client.pool.query('UPDATE `guildData` SET `guildViewCnfCmdsEnabled` = 1 WHERE guild = ?', [message.guild.id], (err) => {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ERROR'))] })
                message.reply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:SUCCESS'))] })
              })
            } else {
              client.pool.query('UPDATE `guildData` SET `guildViewCnfCmdsEnabled` = 0 WHERE guild = ?', [message.guild.id], (err) => {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ERROR'))] })
                message.editReply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:SUCCESS'))] })
              })
            }
          } else {
            message.reply({ embeds: [help] })
          }
          break
        }
        case 'modules': {
          if (Object.prototype.hasOwnProperty.call(message.args, '1') && Object.prototype.hasOwnProperty.call(message.args, '2')) {
            if (message.args[1] === 'enable') {
              if (!columnRelationShip[message.args[2].toLowerCase()]) return message.reply({ embeds: [help] })
              client.pool.query('UPDATE `guildData` SET ?? = 1 WHERE `guild` = ?', [columnRelationShip[message.args[2].toLowerCase()], message.guild.id], (err) => {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::MODULESENABLE:ERROR', { MODULES: message.args[2].toLowerCase() }))] })
                message.reply({ embeds: [Success(i18n(locale, 'ADMIN::MODULESENABLED:SUCCESS', { MODULES: message.args[2].toLowerCase() }))] })
              })
            } else {
              if (!columnRelationShip[message.args[2].toLowerCase()]) return message.reply({ embeds: [help] })
              client.pool.query('UPDATE `guildData` SET ?? = 0 WHERE `guild` = ?', [columnRelationShip[message.args[2].toLowerCase()], message.guild.id], (err) => {
                if (err) client.logError(err)
                if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::MODULESDISABLE:ERROR', { MODULE: message.args[2].toLowerCase() }))] })
                message.reply({ embeds: [Success(i18n(locale, 'ADMIN::MODULESDISABLE:SUCCESS', { MODULE: message.args[2].toLowerCase() }))] })
              })
            }
          } else {
            message.reply({ embeds: [help] })
          }
          break
        }
        case 'setprefix': {
          if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
            client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::SETPREFIX:ERROR'))] })
              message.reply({ embeds: [Success(i18n(locale, 'ADMIN::SETPREFIX:SUCCESS', { guildPrefix: message.args[1] }))] })
            })
          } else {
            // help for this option in development
          }
          break
        }
        case 'setlanguage': {
          if (Object.prototype.hasOwnProperty.call(message.args, '1')) {
            client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [message.args[1], message.guild.id], (err) => {
              if (err) client.logError(err)
              if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::SETLANGUAGE:ERROR'))] })
              message.reply({ embeds: [Success(i18n(locale, 'ADMIN::SETLANGUAGE:SUCCESS', { guildLanguage: message.args[1] }))] })
            })
          } else {
            // help for this option in development
          }
          break
        }
      }
    } else {
      message.reply({ embeds: [help] })
    }
  }
}
