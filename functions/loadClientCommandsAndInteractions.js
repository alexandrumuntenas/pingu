const {Collection} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');
const fs = require('fs');
const client = require('../client.js');

module.exports = client => {
	const commands = new Collection();

	load('./commands');

	async function load(directory) {
		const files = fs.readdirSync(directory);

		for (const file of files) {
			const path = `${directory}/${file}`;

			if (file.endsWith('.js') && !file.endsWith('dev.js')) {
				const command = require(`.${path}`);
				if (command.name) {
					if (!command.interactionData) {
						command.interactionData = new SlashCommandBuilder().setName(command.name).setDescription(command.description || 'Description not set');
					} else {
						command.interactionData.setName(command.name).setDescription(command.description || 'Description not set');
					}

					if (!command.isConfigCommand) {
						command.isConfigCommand = false;
					}

					commands.set(command.name, command);
					client.console.success(`Comando ${file} cargado`);
				} else {
					client.console.warn(`Command ${file} is missing a help.name, or help.name is not a string.`);
					continue;
				}
			} else if (fs.lstatSync(path).isDirectory()) {
				load(path);
			}
		}
	}

	return commands;
};
