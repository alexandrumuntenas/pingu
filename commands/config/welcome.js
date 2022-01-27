const Client = require('../../Client.js');
const {Permissions} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
	name: 'welcome',
	description: 'WELCOME::DESCRIPTION',
	permissions: [Permissions.FLAGS.MANAGE_GUILD],
	timeout: 1,
	isConfigurationCommand: true,
	interactionData: new SlashCommandBuilder()
		.addSubcommand(sc => sc.setName('setchannel').addChannelOption(input => input.setName('channel').setRequired(true)))
		.addSubcommand(sc => sc.setName('setmessage').addStringOption(input => input.setName('message').setRequired(true)))
		.addSubcommand(sc => sc.setName('sendcards').addBooleanOption(input => input.setName('enable').setRequired(true)))
		.addSubcommandGroup(scg => scg.setName('configurecards')
			.addSubcommand(sc => sc.setName('setbackground').addStringOption(input => input.setName('backgroundurl').setRequired(true)))
			.addSubcommand(sc => sc.setName('setoverlayopacity').addNumberOption(input => input.setName('overlayopacity').setRequired(true)))
			.addSubcommand(sc => sc.setName('setoverlaycolor').addStringOption(input => input.setName('overlaycolor').setRequired(true)))
			.addSubcommand(sc => sc.setName('settitle').addStringOption(input => input.setName('title').setRequired(true)))
			.addSubcommand(sc => sc.setName('setsubtitle').addStringOption(input => input.setName('subtitle').setRequired(true))))
		.addSubcommandGroup(scg => scg.setName('configureroles')
			.addSubcommand(sc => sc.setName('give').addRoleOption(input => input.setName('role').setRequired(true)))
			.addSubcommand(sc => sc.setName('remove').addRoleOption(input => input.setName('role').setRequired(true))))
		.addSubcommand(sc => sc.setName('preview')),
	runInteraction(locale, interaction) {
		console.log(interaction.getSubcommandName());
		switch (interaction.getSubcommandName()) {
			case 'setchannel': {
				break;
			}

			case 'setmessage': {
				break;
			}

			case 'sendcards': {
				break;
			}

			case 'configurecards': {
				break;
			}

			case 'configureroles': {
				break;
			}

			default: {
				break;
			}
		}
	},
	runCommand(message, interaction) {

	},
};
