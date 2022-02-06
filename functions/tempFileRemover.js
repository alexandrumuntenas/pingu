const {unlinkSync, stat, readdirSync} = require('fs');

/**
 * Remove files older than 10 minutes every 5 minutes
 */

module.exports = async () => {
	const files = readdirSync('./modules/temp');

	for (const file of files) {
		stat(`./modules/temp/${file}`, (err, stats) => {
			const fileDate = new Date(stats.birthtime);
			const now = new Date();

			if (now - fileDate > 600000) {
				unlinkSync(`./modules/temp/${file}`);
			}
		});
	}
};
