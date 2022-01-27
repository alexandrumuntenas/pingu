const Consolex = require('../functions/consolex');
const CooldownManager = require('../functions/cooldownManager');

const {error, timer} = require('../functions/defaultMessages');
const i18n = require('../i18n/i18n');
const {getGuildConfigNext} = require('../functions/guildDataManager.js');
const humanizeduration = require('humanize-duration');
const customcommands = require('../modules/customcommands');

module.exports = {
	name: 'messageCreate',
	execute: async (Client, message) => {
		if (
			message.channel.type === 'dm'
      || message.author.bot
      || message.author === Client.user
		) {
			return;
		}

		getGuildConfigNext(message.guild, async guildData => {
			Consolex.fatal(JSON.stringify(guildData));
			message.database = guildData;
			if (message.content.startsWith(message.database.guildPrefix) && message.content !== message.database.guildPrefix) {
				message.args = message.content.slice(message.database.guildPrefix.length).trim().split(/ +/);
			}

			if (message.content.startsWith(message.database.guildPrefix) && message.args) {
				let commandToExecute = message.args[0];
				message.args.shift();

				if (Client.commands.has(commandToExecute)) {
					commandToExecute = Client.commands.get(commandToExecute);
					if (commandToExecute.permissions && !message.member.permissions.has(commandToExecute.permissions)) {
						message.reply({embeds: [error(i18n(message.database.guildLanguage || 'en', 'COMMAND::PERMERROR'))]});
						return;
					}

					if (CooldownManager.check(message.member, message.guild, commandToExecute)) {
						CooldownManager.add(message.member, message.guild, commandToExecute);
						if (Object.prototype.hasOwnProperty.call(commandToExecute, 'runCommand')) {
							if (Client.statcord) {
								Client.statcord.postCommand(commandToExecute.name, message.member.id);
							}

							await commandToExecute.runCommand(message.database.guildLanguage || 'en', message);
						} else {
							message.reply({embeds: [error(i18n(message.database.guildLanguage || 'en', 'COMMAND::LEGACYNOAVALIABLE'))]});
						}
					} else {
						message.reply({embeds: [timer(i18n(message.database.guildLanguage || 'en', 'COOLDOWN', {COOLDOWN: humanizeduration(CooldownManager.ttl(message.member, message.guild, commandToExecute), {round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en']})}))]});
					}
				} else if (CooldownManager.check(message.member, message.guild, commandToExecute)) {
					CooldownManager.add(message.member, message.guild, commandToExecute);
					customcommands(message, commandToExecute);
				} else {
					message.reply({embeds: [timer(i18n(message.database.guildLanguage || 'en', 'COOLDOWN', {COOLDOWN: humanizeduration(CooldownManager.ttl(message.member, message.guild, commandToExecute), {round: true, language: message.database.guildLanguage || 'en', fallbacks: ['en']})}))]});
				}
			}

			/* If (message.database.leveling.enabled !== 0) {
				getExperience(message.member);
			} */
		});
	},
};
