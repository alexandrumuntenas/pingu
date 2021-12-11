const { Permissions } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const genericMessages = require('../../functions/genericMessages');
const getLocales = require('../../i18n/getLocales');

module.exports = {
  name: 'p2enmod',
  description: '⚙️ Enable Pingu modules',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('p2enmod')
    .setDescription('Enable Pingu modules')
    .addStringOption((option) => option.setName('module').setDescription('The module to enable')),
  executeInteraction(client, locale, interaction) {
    if (interaction.options.getString('module')) {
      switch (interaction.options.getString('module')) {
        case 'welcomer': {
          client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'joinroles': {
          client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'farewell': {
          client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'moderation': {
          client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'levels': {
          client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'economy': {
          client.pool.query('UPDATE `guildData` SET `economyEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'autoresponder': {
          client.pool.query('UPDATE `guildData` SET `autoresponderEnabled` = 1 WHERE `guild` = ?', [interaction.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        default: {
          helpInteraction(interaction, locale);
          return;
        }
      }
      genericMessages.success(interaction, getLocales(locale, 'P2ENMOD', { PMODULE: `\`${interaction.options.getString('module')}\`` }));
    } else {
      helpInteraction(interaction, locale);
    }
  },
  executeLegacy(client, locale, message) {
    if (message.args[0]) {
      switch (message.args[0]) {
        case 'welcomer': {
          client.pool.query('UPDATE `guildData` SET `welcomeEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'joinroles': {
          client.pool.query('UPDATE `guildData` SET `joinRolesEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'farewell': {
          client.pool.query('UPDATE `guildData` SET `farewellEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'moderation': {
          client.pool.query('UPDATE `guildData` SET `moderationEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'levels': {
          client.pool.query('UPDATE `guildData` SET `levelsEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'economy': {
          client.pool.query('UPDATE `guildData` SET `economyEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        case 'autoresponder': {
          client.pool.query('UPDATE `guildData` SET `autoresponderEnabled` = 1 WHERE `guild` = ?', [message.guild.id], (err) => {
            if (err) client.Sentry.captureException(err);
          });
          break;
        }
        default: {
          helpTray(message, locale);
          return;
        }
      }
      genericMessages.legacy.success(message, getLocales(locale, 'P2ENMOD', { PMODULE: `\`${message.args[0]}\`` }));
    } else {
      helpTray(message, locale);
    }
  }
};

function helpTray(message, locale) {
  genericMessages.legacy.Info.help(message, locale, `${message.database.guildPrefix}p2enmod <module>`, ['welcomer', 'joinroles', 'farewell', 'moderation', 'levels', 'economy', 'autoresponder']);
}

function helpInteraction(message, locale) {
  genericMessages.info.help(message, locale, '/p2dismod <module>', ['welcomer', 'joinroles', 'farewell', 'moderation', 'levels', 'economy', 'autoresponder']);
}
