const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Error, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const { MessageEmbed } = require('discord.js')
const updateGuildConfig = require('../../functions/updateGuildConfig')

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
        if (interaction.options.getBoolean('view')) {
          updateGuildConfig(client, interaction.guild, { column: 'guildViewCnfCmdsEnabled', value: 1 }, (err) => {
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:SUCCESS'))] })
          })
        } else {
          updateGuildConfig(client, interaction.guild, { column: 'guildViewCnfCmdsEnabled', value: 0 }, (err) => {
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:SUCCESS'))] })
          })
        }
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
        updateGuildConfig(client, interaction.guild, { column: columnRelationShip[interaction.options.getString('module')], value: 1 }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEENABLE:ERROR', { MODULE: interaction.options.getString('module') }))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::MODULEENABLE:SUCCESS', { MODULE: interaction.options.getString('module') }))] })
        })
        break
      }
      case 'disable': {
        updateGuildConfig(client, interaction.guild, { column: columnRelationShip[interaction.options.getString('module')], value: 0 }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEDISABLE:ERROR', { MODULE: interaction.options.getString('module') }))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::MODULEDISABLE:SUCCESS', { MODULE: interaction.options.getString('module') }))] })
        })
        break
      }
      case 'setprefix': {
        updateGuildConfig(client, interaction.guild, { column: 'guildPrefix', value: interaction.options.getString('newprefix') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::SETPREFIX:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::SETPREFIX:SUCCESS', { PREFIX: interaction.options.getString('newprefix') }))] })
        })
        break
      }
      case 'setlanguage': {
        updateGuildConfig(client, interaction.guild, { column: 'guildLanguage', value: interaction.options.getString('language') }, (err) => {
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ADMIN::SETLANGUAGE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'ADMIN::SETLANGUAGE:SUCCESS', { LANGUAGE: interaction.options.getString('language') }))] })
        })
        break
      }
    }
  },
  executeLegacy (client, locale, message) {
    const helpTray = Help('admin', i18n(locale, 'ADMIN::HELPTRAY:DESCRIPTION'), [{ option: 'viewcnfcommands', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:VIEWCNFCOMMANDS'), syntax: 'viewcnfcommands <true/false>' }, { option: 'viewconfig', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:VIEWCONFIG'), syntax: 'viewconfig' }, { option: 'modules enable', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:MODULEENABLE'), syntax: 'modules enable <module>' }, { option: 'modules disable', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:MODULEDISABLE'), syntax: 'modules disable <module>' }, { option: 'setprefix', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:SETPREFIX'), syntax: 'setprefix <new prefix>' }, { option: 'setlanguage', description: i18n(locale, 'ADMIN::HELPTRAY:OPTION:SETLANGUAGE'), syntax: 'setlanguage <en/es>' }])
    if (!(message.args && Object.prototype.hasOwnProperty.call(message.args, 0))) return message.reply({ embeds: [helpTray] })
    switch (message.args[0]) {
      case 'viewcnfcommands': {
        if (!Object.prototype.hasOwnProperty.call(message.args, 1)) return message.reply({ embeds: [helpTray] })
        if (message.args[1] === 'true') {
          updateGuildConfig(client, message.guild, { column: 'guildViewCnfCmdsEnabled', value: 1 }, (err) => {
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:ERROR'))] })
            message.reply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:SUCCESS'))] })
          })
        } else {
          updateGuildConfig(client, message.guild, { column: 'guildViewCnfCmdsEnabled', value: 0 }, (err) => {
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:ERROR'))] })
            message.reply({ embeds: [Success(i18n(locale, 'ADMIN::VIEWCNFCOMMANDS:ENABLE:SUCCESS'))] })
          })
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
        if (!(Object.prototype.hasOwnProperty.call(message.args, 1) && Object.prototype.hasOwnProperty.call(message.args, 2) && columnRelationShip[message.args[2].toLowerCase()])) return message.reply({ embeds: [helpTray] })
        if (message.args[1] === 'enable') {
          updateGuildConfig(client, message.guild, { column: columnRelationShip[message.args[2].toLowerCase()], value: 1 }, (err) => {
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEENABLE:ERROR', { MODULE: columnRelationShip[message.args[2].toLowerCase()] }))] })
            message.reply({ embeds: [Success(i18n(locale, 'ADMIN::MODULEENABLE:SUCCESS', { MODULE: columnRelationShip[message.args[2].toLowerCase()] }))] })
          })
        } else {
          updateGuildConfig(client, message.guild, { column: columnRelationShip[message.args[2].toLowerCase()], value: 0 }, (err) => {
            if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::MODULEDISABLE:ERROR', { MODULE: columnRelationShip[message.args[2].toLowerCase()] }))] })
            message.reply({ embeds: [Success(i18n(locale, 'ADMIN::MODULEDISABLE:SUCCESS', { MODULE: columnRelationShip[message.args[2].toLowerCase()] }))] })
          })
        }
        break
      }
      case 'setprefix': {
        if (!Object.prototype.hasOwnProperty.call(message.args, '1')) return message.reply({ embeds: [helpTray] })
        updateGuildConfig(client, message.guild, { column: 'guildPrefix', value: message.args[1] }, (err) => {
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::SETPREFIX:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'ADMIN::SETPREFIX:SUCCESS', { PREFIX: message.args[1] }))] })
        })
        break
      }
      case 'setlanguage': {
        if (!Object.prototype.hasOwnProperty.call(message.args, '1')) return message.reply({ embeds: [helpTray] })
        updateGuildConfig(client, message.guild, { column: 'guildLanguage', value: message.args[1] }, (err) => {
          if (err) return message.reply({ embeds: [Error(i18n(locale, 'ADMIN::SETLANGUAGE:ERROR'))] })
          message.reply({ embeds: [Success(i18n(locale, 'ADMIN::SETLANGUAGE:SUCCESS', { LANGUAGE: message.args[1] }))] })
        })
        break
      }
      default: {
        message.reply({ embeds: [helpTray] })
        break
      }
    }
  }
}
