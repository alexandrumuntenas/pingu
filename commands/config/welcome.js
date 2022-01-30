const {Permissions} = require('discord.js');
const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
	name: 'welcome',
	description: '⚙️ Configure the welcome module',
	permissions: [Permissions.FLAGS.MANAGE_GUILD],
	timeout: 1,
	interactionData: new SlashCommandBuilder()
		.addSubcommand(sc => sc.setName('setchannel').setDescription('Set the welcome channel.').addChannelOption(input => input.setName('channel').setDescription('Set the welcome channel.').setRequired(true)))
		.addSubcommand(sc => sc.setName('setmessage').setDescription('Set the welcome message.').addStringOption(input => input.setName('message').setDescription('Set the welcome message. Avaliable placeholders: {}').setRequired(true)))
		.addSubcommand(sc => sc.setName('sendcards').setDescription('Do you want a welcome card?').addBooleanOption(input => input.setName('enable').setDescription('Do you want a welcome card?').setRequired(true)))
		.addSubcommand(sc => sc.setName('preview').setDescription('Preview the welcome message.'))
		.addSubcommandGroup(scg => scg.setName('configurecards').setDescription('Configure the welcome card.')
			.addSubcommand(sc => sc.setName('setbackground').setDescription('Set the background image url.').addStringOption(input => input.setName('backgroundurl').setDescription('Set the background image url.').setRequired(true)))
			.addSubcommand(sc => sc.setName('setoverlayopacity').setDescription('Set the overlay opacity.').addNumberOption(input => input.setName('overlayopacity').setDescription('Set the overlay opacity.').setRequired(true)))
			.addSubcommand(sc => sc.setName('setoverlaycolor').setDescription('Set the overlay color.').addStringOption(input => input.setName('overlaycolor').setDescription('Set the overlay color.').setRequired(true)))
			.addSubcommand(sc => sc.setName('settitle').setDescription('Set the title. (The text in white).').addStringOption(input => input.setName('title').setDescription('Set the title. (The text in white).').setRequired(true)))
			.addSubcommand(sc => sc.setName('setsubtitle').setDescription('Set the subtitle. (The text darker and smaller than the title).').addStringOption(input => input.setName('subtitle').setDescription('Set the subtitle. (The text darker and smaller than the title).').setRequired(true))))
		.addSubcommandGroup(scg => scg.setName('configureroles').setDescription('Configure the roles that will be given to the new member.')
			.addSubcommand(sc => sc.setName('give').setDescription('Add a role to grant when someone joins the guild.').addRoleOption(input => input.setName('role').setDescription('Add a role to grant when someone joins the guild.').setRequired(true)))
			.addSubcommand(sc => sc.setName('remove').setDescription('Remove a role to grant when someone joins the guild.').addRoleOption(input => input.setName('role').setDescription('Remove a role to grant when someone joins the guild.').setRequired(true)))),
	isConfigurationCommand: true,
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
