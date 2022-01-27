const { Permissions } = require('discord.js');
const i18n = require('../../i18n/i18n');
const { deployGuildInteractions } = require('../../functions/guildDataManager');
const { success } = require('../../functions/defaultMessages');

module.exports = {
	name: 'update',
	description:
		'⚙️ Deploys and updates the Pingu\'s Slash Commands of the the server.',
	permissions: [Permissions.FLAGS.MANAGE_GUILD],
	cooldown: 1,
	executeInteraction(locale, interaction) {
		try {
			deployGuildInteractions(interaction.guild);
		} catch (err) {
			if (err) {
				return interaction.editReply({ embeds: [success(i18n(locale, 'UPDATE::ERROR'))] });
			}

			return interaction.editReply({ embeds: [success(i18n(locale, 'UPDATE::SUCCESS'))] });
		}
	},
	executeLegacy(locale, message) {
		try {
			deployGuildInteractions(message.guild);
		} catch (err) {
			if (err) {
				return message.reply({ embeds: [success(i18n(locale, 'UPDATE::ERROR'))] });
			}

			return message.reply({ embeds: [success(i18n(locale, 'UPDATE::SUCCESS'))] });
		}
	},
};
