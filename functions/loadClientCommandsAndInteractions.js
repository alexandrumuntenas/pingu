const {Collection} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');
const Consolex = require('../functions/consolex');
const fs = require('fs');

module.exports = () => {
	const commands = new Collection();

	load('./commands');

	async function load(directory) {
		const files = fs.readdirSync(directory);

		for (const file of files) {
			const path = `${directory}/${file}`;

			if (file.endsWith('.js') && !file.endsWith('dev.js')) {
				const command = require(`.${path}`);
				if (Object.prototype.hasOwnProperty.call(command, 'name')) {
					if (Object.prototype.hasOwnProperty.call(command, 'interactionData')) {
						//! LAS INTERACCIONES SERÁN GESTIONADAS POR UN SUBPROCESO
						command.interactionData.setName(command.name).setDescription(command.description || 'Description not set');
					} else {
						command.interactionData = new SlashCommandBuilder().setName(command.name).setDescription(command.description || 'Description not set');
					}

					if (!command.isConfigCommand) {
						command.isConfigCommand = false;
					}

					commands.set(command.name, command);
					Consolex.success(`Comando ${file} cargado`);
				} else {
					Consolex.warn(`Command ${file} is missing a help.name, or help.name is not a string.`);
					continue;
				}
			} else if (fs.lstatSync(path).isDirectory()) {
				load(path);
			}
		}
	}

	return commands;
};
