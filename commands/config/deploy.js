const { Permissions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const genericMessages = require('../../functions/genericMessages');

const rest = new REST({ version: '9' });
if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN2);
} else {
  rest.setToken(process.env.PUBLIC_TOKEN);
}

module.exports = {
  name: 'deploy',
  description: '⚙️ Deploys the Pingu\'s Slash Commands to the server.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  executeInteraction(client, locale, interaction) {
    genericMessages.info.loader(interaction, 'Deploying commands...');
    client.log.info(`Deploying commands to ${interaction.guild.id}`);
    let bodyToSend = [];
    let welcome; let joinroles; let farewell; let levels; let
economy;
    if (interaction.database.welcomeEnabled !== 0) welcome = client.interactions.filter((command) => command.module === 'welcome').map((command) => command.interaction.toJSON()) || [];
    if (interaction.database.farewellEnabled !== 0) farewell = client.interactions.filter((command) => command.module === 'farewell').map((command) => command.interaction.toJSON()) || [];
    if (interaction.database.joinRolesEnabled !== 0) joinroles = client.interactions.filter((command) => command.module === 'joinroles').map((command) => command.interaction.toJSON()) || [];
    if (interaction.database.levelsEnabled !== 0) levels = client.interactions.filter((command) => command.module === 'levels').map((command) => command.interaction.toJSON()) || [];
    if (interaction.database.economyEnabled !== 0) economy = client.interactions.filter((command) => command.module === 'economy').map((command) => command.interaction.toJSON()) || [];
    bodyToSend = client.interactions.filter((command) => !command.module).map((command) => command.interaction.toJSON());

    bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || []);

    rest.put(Routes.applicationGuildCommands(client.user.id, interaction.guild.id), { body: bodyToSend })
      .then(() => genericMessages.success(interaction, 'Successfully registered application commands.'))
      .catch(console.error);
  },
  executeLegacy(client, locale, message) {
    client.log.info(`Deploying commands to ${message.guild.id}`);
    let bodyToSend = [];
    let welcome; let joinroles; let farewell; let levels; let
economy;
    if (message.database.welcomeEnabled !== 0) welcome = client.interactions.filter((command) => command.module === 'welcome').map((command) => command.interaction.toJSON()) || [];
    if (message.database.farewellEnabled !== 0) farewell = client.interactions.filter((command) => command.module === 'farewell').map((command) => command.interaction.toJSON()) || [];
    if (message.database.joinRolesEnabled !== 0) joinroles = client.interactions.filter((command) => command.module === 'joinroles').map((command) => command.interaction.toJSON()) || [];
    if (message.database.levelsEnabled !== 0) levels = client.interactions.filter((command) => command.module === 'levels').map((command) => command.interaction.toJSON()) || [];
    if (message.database.economyEnabled !== 0) economy = client.interactions.filter((command) => command.module === 'economy').map((command) => command.interaction.toJSON()) || [];
    bodyToSend = client.interactions.filter((command) => !command.module).map((command) => command.interaction.toJSON());

    bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || []);

    rest.put(Routes.applicationGuildCommands(client.user.id, message.guild.id), { body: bodyToSend })
      .then(() => genericMessages.legacy.success(message, 'Successfully registered application commands.'))
      .catch(console.error);
  }
};
