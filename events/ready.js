const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const getGuildConfig = require('../functions/getGuildConfig');
const generateTheCommandListOfTheGuild = require('../functions/generateTheCommandListOfTheGuild');

const rest = new REST({ version: '9' });
if (process.env.ENTORNO === 'desarrollo') {
  rest.setToken(process.env.INSIDER_TOKEN);
} else {
  rest.setToken(process.env.PUBLIC_TOKEN);
}

module.exports = {
  name: 'ready',
  execute: (client) => {
    client.console.info(`Conectado como ${client.user.tag}!`);
    if (client.statcord) client.statcord.autopost();
    updateGuildCommands(client);
    setInterval(() => {
      updateGuildCommands(client);
    }, 86400000);
  }
};

function updateGuildCommands(client) {
  client.guilds.fetch().then((guilds) => {
    guilds.forEach((guild) => {
      client.console.info(`Deploying commands to ${guild.id}`);
      getGuildConfig(client, guild, (guildConfig) => {
        generateTheCommandListOfTheGuild(client, guildConfig, (commandListOfTheGuild) => {
          rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: commandListOfTheGuild })
            .then(() => {
              client.console.success(`Commands deployed succesfully to ${guild.id}`);
            })
            .catch(console.error);
        });
      });
    });
  });
}
