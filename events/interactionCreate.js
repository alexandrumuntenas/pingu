const {error, timer} = require('../functions/defaultMessages');
const {getGuildConfigNext} = require('../functions/guildDataManager.js');
const i18n = require('../i18n/i18n');
const humanizeduration = require('humanize-duration');

module.exports = {
	name: 'interactionCreate',
	execute: async (client, interaction) => {
		if (interaction.isCommand()) {
			module.exports.isCommand(client, interaction).catch(err => {
				client.console.fatal(err);
				client.logError(err);
			});
		}
	},
};

module.exports.isCommand = async (client, interaction) => {
	const {commandName} = interaction;
	interaction.replyData = await interaction.deferReply({fetchReply: true});
	if (
		interaction.channel.type === 'dm'
    || interaction.author === client.user
	) {
		return;
	}

	getGuildConfigNext(client, interaction.guild, async guildData => {
		interaction.database = guildData;
		client.console.fatal(JSON.stringify(guildData));
		if (client.commands.has(commandName)) {
			const commandToExecute = client.commands.get(commandName);
			if (commandToExecute.permissions && !interaction.member.permissions.has(commandToExecute.permissions)) {
				interaction.editReply({embeds: [error(i18n(interaction.database.guildLanguage || 'en', 'COMMAND_PERMISSION_ERROR'))]});
				return;
			}

			if (client.cooldownManager.check(interaction.member, interaction.guild, commandToExecute)) {
				client.cooldownManager.add(interaction.member, interaction.guild, commandToExecute);
				if (client.statcord) {
					client.statcord.postCommand(commandToExecute.name, '000000000000000');
				}

				await commandToExecute.runInteraction(client, interaction.database.guildLanguage || 'en', interaction);
			} else {
				interaction.editReply({embeds: [timer(i18n(interaction.database.guildLanguage || 'en', 'COOLDOWN', {COOLDOWN: humanizeduration(client.cooldownManager.ttl(interaction.member, interaction.guild, commandToExecute), {round: true, language: interaction.database.guildLanguage || 'en', fallbacks: ['en']})}))]});
			}
		} else {
			interaction.editReply({content: 'This command is not longer working on Pingu. To remove this command from the list, please redeploy the commands using `update`.'});
		}
	});
};
