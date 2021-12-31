const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Error, Info } = require('../../modules/constructor/messageBuilder')
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
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'SUCCESS'))] })
          })
        } else {
          client.pool.query('UPDATE `guildData` SET `guildViewCnfCmdsEnabled` = 0 WHERE guild = ?', [interaction.guild.id], (err) => {
            if (err) client.logError(err)
            if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
            interaction.editReply({ embeds: [Success(i18n(locale, 'SUCCESS'))] })
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
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'SUCCESS'))] })
        })
        break
      }
      case 'disable': {
        const module = interaction.options.getString('module')
        client.pool.query('UPDATE `guildData` SET ?? = 0 WHERE `guild` = ?', [columnRelationShip[module], interaction.guild.id], (err) => {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'SUCCESS'))] })
        })
        break
      }
      case 'setprefix': {
        client.pool.query('UPDATE `guildData` SET `guildPrefix` = ? WHERE `guild` = ?', [interaction.options.getString('newprefix'), interaction.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        interaction.editReply({ embeds: [Success(i18n(locale, 'SETPREFIX_SUCCESS', { guildPrefix: `\`${interaction.options.getString('newprefix')}\`` }))] })
        break
      }
      case 'setlanguage': {
        client.pool.query('UPDATE `guildData` SET `guildLanguage` = ? WHERE `guild` = ?', [interaction.options.getString('language'), interaction.guild.id], (err) => {
          if (err) client.Sentry.captureException(err)
        })
        interaction.editReply({ embeds: [Success(i18n(interaction.options.getString('language'), 'SETLANGUAGE_SUCCESS', { guildLanguage: `\`${interaction.options.getString('language')}\`` }))] })
        break
      }
    }
  }
}
