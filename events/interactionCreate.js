const Consolex = require('../functions/consolex');
const CooldownManager = require('../functions/cooldownManager');

const {error, timer} = require('../functions/defaultMessages');
const {getGuildConfigNext} = require('../functions/guildDataManager.js');
const i18n = require('../i18n/i18n');
const humanizeduration = require('humanize-duration');

module.exports = {
	name: 'interactionCreate',
	execute: async (Client, interaction) => {
		if (interaction.isCommand()) {
			module.exports.isCommand(Client, interaction).catch(Consolex.handleError);
		}
	},
};

module.exports.isCommand = async (Client, interaction) => {
	const {commandName} = interaction;
	interaction.replyData = await interaction.deferReply({fetchReply: true});
	if (
		interaction.channel.type === 'dm'
    || interaction.author === Client.user
	) {
		return;
	}

	getGuildConfigNext(interaction.guild, async guildData => {
		interaction.database = guildData;
		Consolex.fatal(JSON.stringify(guildData));
		if (Client.commands.has(commandName)) {
			const commandToExecute = Client.commands.get(commandName);
			if (commandToExecute.permissions && !interaction.member.permissions.has(commandToExecute.permissions)) {
				interaction.editReply({embeds: [error(i18n(interaction.database.guildLanguage || 'en', 'COMMAND_PERMISSION_ERROR'))]});
				return;
			}

			if (CooldownManager.check(interaction.member, interaction.guild, commandToExecute)) {
				CooldownManager.add(interaction.member, interaction.guild, commandToExecute);
				if (Client.statcord) {
					Client.statcord.postCommand(commandToExecute.name, '000000000000000');
				}

				await commandToExecute.runInteraction(interaction.database.guildLanguage || 'en', interaction);
			} else {
				interaction.editReply({embeds: [timer(i18n(interaction.database.guildLanguage || 'en', 'COOLDOWN', {COOLDOWN: humanizeduration(CooldownManager.ttl(interaction.member, interaction.guild, commandToExecute), {round: true, language: interaction.database.guildLanguage || 'en', fallbacks: ['en']})}))]});
			}
		} else {
			interaction.editReply({content: 'This command is not longer working on Pingu. To remove this command from the list, please redeploy the commands using `update`.'});
		}
	});
};
