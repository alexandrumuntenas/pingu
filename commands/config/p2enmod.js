const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Help } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  name: 'p2enmod',
  description: '⚙️ Enable Pingu modules',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('p2enmod')
    .setDescription('Enable Pingu modules')
    .addStringOption(option => option.setName('module').setDescription('The module to enable')),
  executeInteraction (client, locale, interaction) {
    if (interaction.options.getString('module')) {
      switch (interaction.options.getString('module')) {
        case 'welcomer': {
          client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'joinroles': {
          client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'farewell': {
          client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'moderation': {
          client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'levels': {
          client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'economy': {
          client.pool.query('UPDATE `guildData` SET `economyEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'autoresponder': {
          client.pool.query('UPDATE `guildData` SET `autoresponderEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        default: {
          interaction.editReply({ embeds: [helpTray] })
          return
        }
      }
      interaction.editReply({ embeds: [Success(i18n(locale, 'P2ENMOD', { PMODULE: `\`${interaction.options.getString('module')}\`` }))] })
    } else {
      interaction.editReply({ embeds: [helpTray] })
    }
  },
  executeLegacy (client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'welcomer': {
          client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'joinroles': {
          client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'farewell': {
          client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'moderation': {
          client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'levels': {
          client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'economy': {
          client.pool.query('UPDATE `guildData` SET `economyEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        case 'autoresponder': {
          client.pool.query('UPDATE `guildData` SET `autoresponderEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err)
          })
          break
        }
        default: {
          message.reply({ embeds: [helpTray] })
          return
        }
      }
      message.reply({ embeds: [Success(i18n(locale, 'P2ENMOD', { PMODULE: `\`${message.args[0]}\`` }))] })
    } else {
      message.reply({ embeds: [helpTray] })
    }
  }
}

const helpTray = Help('p2enmod', 'Enable Pingu modules', [{ option: 'module', description: 'The module to disable. Modules avaliable: welcomer, joinroles, farewell, moderation, levels, economy, autoresponder' }])
