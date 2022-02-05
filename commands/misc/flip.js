const {MessageEmbed} = require('discord.js');
const flip = require('flipacoin');
const i18n = require('../../i18n/i18n');

module.exports = {
	name: 'flip',
	description: '🪙 Flip a coin',
	cooldown: 1,
	runInteraction(locale, interaction) {
		const embed = new MessageEmbed().setColor('#007BFF');
		if (flip() === 'head') {
			embed.setDescription(`:coin: ${i18n(locale, 'FLIP::HEADS')}`);
		} else {
			embed.setDescription(`:coin: ${i18n(locale, 'FLIP::TAILS')}`);
		}

		interaction.editReply({embeds: [embed]});
	},
	runCommand(locale, message) {
		const embed = new MessageEmbed().setColor('#007BFF');
		if (flip() === 'head') {
			embed.setDescription(`:coin: ${i18n(locale, 'FLIP::HEADS')}`);
		} else {
			embed.setDescription(`:coin: ${i18n(locale, 'FLIP::TAILS')}`);
		}

		message.reply({embeds: [embed]});
	},
};
