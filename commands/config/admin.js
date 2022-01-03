const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Error, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const { MessageEmbed } = require('discord.js')

const columnRelationShip = {
  welcomer: 'welcomeEnabled',
  farewell: 'farewellEnabled',
  joinroles: 'joinRolesEnabled',
  levels: 'levelsEnabled',
  economy: 'economyEnabled',
  autoresponder: 'autoresponderEnabled',
  suggestions: 'suggestionsEnabled',
  customcommands: 'customcommandsEnabled'
}

const emojiRelation = { 1: '<:discord_online:876102925129236481>', 0: '<:discord_offline:876102753821278238>' }

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
        const configStatus = new MessageEmbed()
          .setColor('#2F3136')
          .setTitle(i18n(locale, 'ADMIN::VIEWCONFIG:EMBED:TITLE'))
          .setDescription(`${i18n(locale, 'MODULES::AUTORESPONDER')}: ${emojiRelation[interaction.database.autoresponderEnabled]}\n${i18n(locale, 'MODULES::CUSTOMCOMMANDS')}: ${emojiRelation[interaction.database.customcommandsEnabled]}\n${i18n(locale, 'MODULES::ECONOMY')}: ${emojiRelation[interaction.database.economyEnabled]}\n${i18n(locale, 'MODULES::FAREWELL')}: ${emojiRelation[interaction.database.farewellEnabled]}\n${i18n(locale, 'MODULES::JOINROLES')}: ${emojiRelation[interaction.database.joinRolesEnabled]}\n${i18n(locale, 'MODULES::LEVELING')}: ${emojiRelation[interaction.database.levelsEnabled]}\n${i18n(locale, 'MODULES::SUGGESTIONS')}: ${emojiRelation[interaction.database.suggestionsEnabled]}\n${i18n(locale, 'MODULES::WELCOMER')}: ${emojiRelation[interaction.database.welcomeEnabled]}`)
        interaction.editReply({ embeds: [configStatus] })
        break
      }
      case 'enable': {
        const module = interaction.options.getString('module')
        client.pool.query('UPDATE `guildData` SET ?? = 1 WHERE `guild` = ?', [columnRelationShip[module], interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEENABLE:ERROR', { MODULE: module }))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::MODULEENABLE:SUCCESS', { MODULE: module }))] })
        })
        break
      }
      case 'disable': {
        const module = interaction.options.getString('module')
        client.pool.query('UPDATE `guildData` SET ?? = 0 WHERE `guild` = ?', [columnRelationShip[module], interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEDISABLE:ERROR', { MODULE: module }))] })
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
    const help = Help('admin', i18n(locale, 'ADMIN::HELPTRAY:DESCRIPTION'), [{ option: 'viewcnfcommands', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:VIEWCNFCOMMANDS'), syntax: 'viewcnfcommands <true/false>' }, { option: 'modules viewconfig', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:VIEWCONFIG'), syntax: 'modules viewconfig' }, { option: 'modules enable', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:MODULEENABLE'), syntax: 'modules enable <module>' }, { option: 'modules disable', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:MODULEDISABLE'), syntax: 'modules disable <module>' }, { option: 'setprefix', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:SETPREFIX'), syntax: 'setprefix <new prefix>' }, { option: 'setlanguage', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:SETLANGUAGE'), syntax: 'setlanguage <en/es>' }])
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
        case 'viewconfig': {
          const configStatus = new MessageEmbed()
            .setColor('#2F3136')
            .setTitle(i18n(locale, 'ADMIN::VIEWCONFIG:EMBED:TITLE'))
            .setDescription(`${i18n(locale, 'MODULES::AUTORESPONDER')}: ${emojiRelation[message.database.autoresponderEnabled]}\n${i18n(locale, 'MODULES::CUSTOMCOMMANDS')}: ${emojiRelation[message.database.customcommandsEnabled]}\n${i18n(locale, 'MODULES::ECONOMY')}: ${emojiRelation[message.database.economyEnabled]}\n${i18n(locale, 'MODULES::FAREWELL')}: ${emojiRelation[message.database.farewellEnabled]}\n${i18n(locale, 'MODULES::JOINROLES')}: ${emojiRelation[message.database.joinRolesEnabled]}\n${i18n(locale, 'MODULES::LEVELING')}: ${emojiRelation[message.database.levelsEnabled]}\n${i18n(locale, 'MODULES::SUGGESTIONS')}: ${emojiRelation[message.database.suggestionsEnabled]}\n${i18n(locale, 'MODULES::WELCOMER')}: ${emojiRelation[message.database.welcomeEnabled]}`)
          message.reply({ embeds: [configStatus] })
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
            message.reply({ embeds: [help] })
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
            message.reply({ embeds: [help] })
          }
          break
        }
      }
    } else {
      message.reply({ embeds: [help] })
    }
  }
}
