const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const getLocales = require('../../i18n/getLocales')

module.exports = {
  name: 'p2dismod',
  description: '⚙️ Disable Pingu modules',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('p2dismod')
    .setDescription('Disable Pingu modules')
    .addStringOption(option => option.setName('module').setDescription('The module to disable')),
  executeInteraction (client, locale, interaction) {
    if (interaction.options.getString('module')) {
      switch (interaction.options.getString('module')) {
        case 'welcomer': {
          client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'joinroles': {
          client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'farewell': {
          client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'moderation': {
          client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'levels': {
          client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'economy': {
          client.pool.query('UPDATE `guildData` SET `economyEnabled` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'autoresponder': {
          client.pool.query('UPDATE `guildData` SET `autoresponderEnabled` = 0 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        default: {
          interaction.editReply({ embeds: [helpTray] })
          return
        }
      }
      interaction.editReply({ embeds: [Success(getLocales(locale, 'P2DISMOD', { PMODULE: `\`${interaction.options.getString('module')}\`` }))] })
    } else {
      interaction.editReply({ embeds: [helpTray] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'welcomer': {
          client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'joinroles': {
          client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'farewell': {
          client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'moderation': {
          client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'levels': {
          client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'economy': {
          client.pool.query('UPDATE `guildData` SET `economyEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'autoresponder': {
          client.pool.query('UPDATE `guildData` SET `autoresponderEnabled` = 0 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        default: {
          message.reply({ embeds: [helpTray] })
          return
        }
      }
      message.reply({ embeds: [Success(getLocales(locale, 'P2DISMOD', { PMODULE: `\`${message.args[0]}\`` }))] })
    } else {
      message.reply({ embeds: [helpTray] })
    }
  }
}

const helpTray = Help('p2dismod', '⚙️ Disable Pingu modules', [{ option: 'module', description: 'The module to disable. Modules avaliable: welcomer, joinroles, farewell, moderation, levels, economy, autoresponder' }])
