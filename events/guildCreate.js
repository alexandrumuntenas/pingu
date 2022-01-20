const getGuildConfig = require('../functions/getGuildConfig');

module.exports = {
  name: 'guildCreate',
  execute: async (client, guild) => {
    const gC = client.console.sentry.startTransaction({
      op: 'guildCreate',
      name: 'Guild Create'
    });
    getGuildConfig(client, guild, () => { });
    gC.finish();
  }
};
