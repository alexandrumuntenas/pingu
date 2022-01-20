const { Error, Timer } = require('../modules/constructor/messageBuilder');
const i18n = require('../i18n/i18n');
const autoresponder = require('../modules/autoresponder');
const getGuildConfig = require('../functions/getGuildConfig');
const { rankUp } = require('../modules/levels');
const humanizeduration = require('humanize-duration');
const customcommands = require('../modules/customcommands');

module.exports = {
  name: 'messageCreate',
  execute: async (client, message) => {
    if (
      message.channel.type === 'dm'
      || message.author.bot
      || message.author === client.user
    ) return;
    getGuildConfig(client, message.guild, async (guildData) => {
      message.database = guildData;
      if (message.content.startsWith(message.database.guildPrefix) && message.content !== message.database.guildPrefix) {
        message.args = message.content.slice(message.database.guildPrefix.length).trim().split(/ +/);
      }
      if (message.content.startsWith(message.database.guildPrefix) && message.args) {
        let commandToExecute = message.args[0];
        message.args.shift();

        if (client.commands.has(commandToExecute)) {
          commandToExecute = client.commands.get(commandToExecute);
          if (commandToExecute.permissions && !message.member.permissions.has(commandToExecute.permissions)) {
            message.reply({ embeds: [Error(i18n(message.database.guildLanguage || 'en', 'COMMAND::PERMERROR'))] });
            return;
          }
          if (client.cooldownManager.check(message.member, message.guild, commandToExecute)) {
            client.cooldownManager.add(message.member, message.guild, commandToExecute);
            if (Object.prototype.hasOwnProperty.call(commandToExecute, 'executeLegacy')) {
              if (client.statcord) client.statcord.postCommand(commandToExecute.name, message.member.id);
              await commandToExecute.executeLegacy(client, message.database.guildLanguage || 'en', message);
            } else {
              message.reply({ embeds: [Error(i18n(message.database.guildLanguage || 'en', 'COMMAND::LEGACYNOAVALIABLE'))] });
            }
          } else {
            message.reply({ embeds: [Timer(i18n(message.database.guildLanguage || 'en', 'COOLDOWN', { COOLDOWN: humanizeduration(client.cooldownManager.ttl(message.member, message.guild, commandToExecute), { round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en'] }) }))] });
            return;
          }
        } else if (client.cooldownManager.check(message.member, message.guild, commandToExecute)) {
            client.cooldownManager.add(message.member, message.guild, commandToExecute);
            customcommands(client, message, commandToExecute);
          } else {
            message.reply({ embeds: [Timer(i18n(message.database.guildLanguage || 'en', 'COOLDOWN', { COOLDOWN: humanizeduration(client.cooldownManager.ttl(message.member, message.guild, commandToExecute), { round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en'] }) }))] });
            return;
          }
      }
      if (message.database.levelsEnabled !== 0) {
        rankUp(client, message);
      }

      if (message.database.autoresponderEnabled !== 0) {
        autoresponder(client, message);
      }
    });
  }
};
