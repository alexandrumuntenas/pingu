const {MessageEmbed} = require('discord.js');
const {getLeaderboard} = require('../../modules/leveling');
const i18n = require('../../i18n/i18n');

module.exports = {
	name: 'leaderboard',
	module: 'leveling',
	description: '🏆 Get the guild leveling leaderboard',
	runInteraction(locale, interaction) {
		getLeaderboard(interaction.guild, leaderboard => {
			const leaderboardEmbed = new MessageEmbed()
				.setColor('#FEE75C')
				.setTitle(`:trophy: ${i18n(locale, 'RANKING')} TOP 25`)
				.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
				.setTimestamp();

			let leaderboardStr = '';
			let count = 0;

			leaderboard.forEach(row => {
				process.Client.users.fetch(row.member).then(user => {
					count++;
					leaderboardStr = `${leaderboardStr}\n${count}. **${user.username
					}#${user.discriminator}** (${i18n(locale, 'LEVEL')}: ${row.lvlLevel
					}, ${i18n(locale, 'EXPERIENCE')} ${row.lvlExperience}) `;
					if (count === leaderboard.length) {
						interaction.editReply({
							embeds: [leaderboardEmbed.setDescription(leaderboardStr)],
						});
					}
				});
			});
		});
	},
	runCommand(locale, message) {
		getLeaderboard(message.guild, leaderboard => {
			const leaderboardEmbed = new MessageEmbed()
				.setColor('#FEE75C')
				.setTitle(`:trophy: ${i18n(locale, 'RANKING')} TOP 25`)
				.setFooter({text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL()})
				.setTimestamp();

			let leaderboardStr = '';
			let count = 0;

			leaderboard.forEach(row => {
				process.Client.users.fetch(row.member).then(user => {
					count++;
					leaderboardStr = `${leaderboardStr}\n${count}. **${user.username
					}#${user.discriminator}** (${i18n(locale, 'LEVEL')}: ${row.lvlLevel
					}, ${i18n(locale, 'EXPERIENCE')} ${row.lvlExperience}) `;
					if (count === leaderboard.length) {
						message.reply({
							embeds: [leaderboardEmbed.setDescription(leaderboardStr)],
						});
					}
				});
			});
		});
	},
};
