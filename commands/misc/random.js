const {MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');
const Math = require('mathjs');

module.exports = {
	cooldown: 1,
	name: 'random',
	description:
    '🔢 Generates a random number between 1 and the specified number',
	interactionData: new SlashCommandBuilder()
		.addIntegerOption(option =>
			option
				.setName('maxnumber')
				.setDescription('Enter an integer')
				.setRequired(true),
		),
	runInteraction(client, locale, interaction) {
		const messageSent = new MessageEmbed().setColor('#007BFF');
		const specifiedRandom = Math.round(
			Math.random(1, parseInt(interaction.options.getInteger('maxnumber'), 10)),
		);
		messageSent.setDescription(`:abacus: **${specifiedRandom}**`);
		interaction.editReply({embeds: [messageSent]});
	},
	runCommand(client, locale, message) {
		const messageSent = new MessageEmbed().setColor('#007BFF');
		if (message.args[0]) {
			const specifiedRandom = Math.round(
				Math.random(1, parseInt(message.args[0], 10)),
			);
			messageSent.setDescription(`:abacus: **${specifiedRandom}**`);
		} else {
			const unspecifiedRandom = Math.round(Math.random(1, 100));
			messageSent.setDescription(`:abacus: **${unspecifiedRandom}**`);
		}

		message.reply({embeds: [messageSent]});
	},
};
