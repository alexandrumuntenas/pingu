const {SlashCommandBuilder} = require('@discordjs/builders');
const {createCustomCommand, deleteCustomCommand} = require('../../modules/customcommands');
const i18n = require('../../i18n/i18n');
const {success, error} = require('../../functions/defaultMessages');

module.exports = {
	name: 'customcommands',
	description: '⚙️ Manage the custom commands of your server',
	cooldown: 5,
	isConfigurationCommand: true,
	interactionData: new SlashCommandBuilder()
		.addSubcommand(sc => sc.setName('create').setDescription('Create a new custom command.')
			.addStringOption(input => input.setName('name').setRequired(true).setDescription('The name of the command.'))
			.addStringOption(input => input.setName('reply').setRequired(true).setDescription('The reply of the command.'))
			.addBooleanOption(input => input.setName('sendinembed').setDescription('Whether or not the reply should be sent in an embed.'))
			.addStringOption(input => input.setName('sendinembed_title').setDescription('The title of the embed.'))
			.addStringOption(input => input.setName('sendinembed_description').setDescription('The description of the embed.'))
			.addStringOption(input => input.setName('sendinembed_thumbnail').setDescription('The thumbnail of the embed.'))
			.addStringOption(input => input.setName('sendinembed_image').setDescription('The image of the embed.'))
			.addStringOption(input => input.setName('sendinembed_url').setDescription('The url of the embed.'))
			.addStringOption(input => input.setName('sendinembed_color').setDescription('The color of the embed.'))
			.addRoleOption(input => input.setName('role').setDescription('Give a role when the command is used.'))
			.addChannelOption(input => input.setName('channel').setDescription('Send the reply to a specified channel.'))
			.addBooleanOption(input => input.setName('sendtodm').setDescription('Whether or not the reply should be sent to the user.')))
		.addSubcommand(sc => sc.setName('delete').setDescription('Delete a custom command.')
			.addStringOption(input => input.setName('name').setRequired(true).setDescription('The name of the custom command.'))),
	runInteraction(locale, interaction) {
		switch (interaction.options.getSubcommand()) {
			case 'create': {
				const customcommand = {command: interaction.options.getString('name'), reply: interaction.options.getString('reply')};

				if (interaction.options.getBoolean('sendinembed')) {
					customcommand.sendInEmbed = true;
					customcommand.sendInEmbed.description = customcommand.reply;
				}

				if (interaction.options.getBoolean('sendtodm')) {
					customcommand.sendDM = true;
				}

				if (interaction.options.getString('sendinembed_title')) {
					customcommand.sendInEmbed.title = interaction.options.getString('sendinembed_title');
				}

				if (interaction.options.getString('sendinembed_description')) {
					customcommand.sendInEmbed.description = interaction.options.getString('sendinembed_description');
				}

				if (interaction.options.getString('sendinembed_thumbnail')) {
					customcommand.sendInEmbed.thumbnail = interaction.options.getString('sendinembed_thumbnail');
				}

				if (interaction.options.getString('sendinembed_image')) {
					customcommand.sendInEmbed.image = interaction.options.getString('sendinembed_image');
				}

				if (interaction.options.getString('sendinembed_url')) {
					customcommand.sendInEmbed.url = interaction.options.getString('sendinembed_url');
				}

				if (interaction.options.getString('sendinembed_color')) {
					customcommand.sendInEmbed.color = interaction.options.getString('sendinembed_color');
				}

				if (interaction.options.getRole('role')) {
					customcommand.setRole = interaction.options.getRole('role').id;
				}

				try {
					createCustomCommand(interaction.guild, customcommand);
					interaction.editReply({embeds: [success(i18n(locale, 'CUSTOMCOMMANDS::CREATE:SUCCESS', {COMMAND: customcommand.command}))]});
				} catch {
					interaction.editReply({embeds: [error(i18n(locale, 'CUSTOMCOMMANDS::CREATE:ERROR', {COMMAND: customcommand.command}))]});
				}

				break;
			}

			case 'delete': {
				try {
					deleteCustomCommand(interaction.guild, interaction.options.getString('name'));
					interaction.editReply({embeds: [success(i18n(locale, 'CUSTOMCOMMANDS::DELETE:SUCCESS', {COMMAND: interaction.options.getString('name')}))]});
				} catch {
					interaction.editReply({embeds: [error(i18n(locale, 'CUSTOMCOMMANDS::DELETE:ERROR', {COMMAND: interaction.options.getString('name')}))]});
				}

				break;
			}

			default: {
				break;
			}
		}
	},
};
