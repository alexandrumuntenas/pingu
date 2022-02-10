const {Permissions} = require('discord.js');
const i18n = require('../../i18n/i18n');
const {deployGuildInteractions} = require('../../functions/guildDataManager');
const {success, error} = require('../../functions/defaultMessages');
const Consolex = require('../../functions/consolex');

module.exports = {
	name: 'update',
	description:
		'⚙️ Deploys and updates the Pingu\'s Slash Commands of the the server.',
	permissions: [Permissions.FLAGS.MANAGE_GUILD],
	cooldown: 1,
	runInteraction(locale, interaction) {
		try {
			deployGuildInteractions(interaction.guild, err => {
				if (err) {
					interaction.editReply({embeds: [error(i18n(locale, 'UPDATE::ERROR'))]});
					throw err;
				}

				return interaction.editReply({embeds: [success(i18n(locale, 'UPDATE::SUCCESS'))]});
			});
		} catch (err) {
			Consolex.handleError(err);
		}
	},
	runCommand(locale, message) {
		try {
			deployGuildInteractions(message.guild, err => {
				if (err) {
					message.reply({embeds: [error(i18n(locale, 'UPDATE::ERROR'))]});
					throw err;
				}

				return message.reply({embeds: [success(i18n(locale, 'UPDATE::SUCCESS'))]});
			});
		} catch (err) {
			Consolex.handleError(err);
		}
	},
};
