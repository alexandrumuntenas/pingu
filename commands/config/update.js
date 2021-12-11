const { Permissions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const genericMessages = require('../../functions/genericMessages');
const guildFetchData = require('../../modules/guildFetchData');

const rest = new REST({ version: '9' });
if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN);
} else {
  rest.setToken(process.env.PUBLIC_TOKEN);
}

/*
  welcome: 'welcomeEnabled',
  joinroles: 'joinRolesEnabled',
  farewell: 'farewellEnabled',
  levels: 'levelsEnabled',
  economy: 'economyEnabled'
*/

module.exports = {
  name: 'update',
  description: '⚙️ Deploys and updates the Pingu\'s Slash Commands of all the servers.',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  executeInteraction(client, locale, interaction) {
    if (interaction.member.id === '722810818823192629') {
      genericMessages.info.loader(interaction, 'Deploying commands...');
      client.guilds.cache.forEach(async (guild) => {
        guildFetchData(client, guild.id, (data) => {
          client.log.info(`Deploying commands to ${guild.id}`);
          let bodyToSend = [];
          let welcome; let joinroles; let farewell; let levels; let
economy;
          if (data.welcomeEnabled !== 0) welcome = client.interactions.filter((command) => command.module === 'welcome').map((command) => command.interaction.toJSON()) || [];
          if (data.farewellEnabled !== 0) farewell = client.interactions.filter((command) => command.module === 'farewell').map((command) => command.interaction.toJSON()) || [];
          if (data.joinRolesEnabled !== 0) joinroles = client.interactions.filter((command) => command.module === 'joinroles').map((command) => command.interaction.toJSON()) || [];
          if (data.levelsEnabled !== 0) levels = client.interactions.filter((command) => command.module === 'levels').map((command) => command.interaction.toJSON()) || [];
          if (data.economyEnabled !== 0) economy = client.interactions.filter((command) => command.module === 'economy').map((command) => command.interaction.toJSON()) || [];
          bodyToSend = client.interactions.filter((command) => !command.module).map((command) => command.interaction.toJSON());

          bodyToSend = bodyToSend.concat(welcome || [], joinroles || [], farewell || [], levels || [], economy || []);

          rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: bodyToSend })
            .then(() => client.log.success(`Commands deployed to ${guild.id}`))
            .catch(console.error);
        });
      });
      genericMessages.success(interaction, 'Successfully deployed commands!');
    } else {
      genericMessages.error(interaction, 'You are not allowed to use this command.');
    }
  }
};