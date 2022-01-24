const { Collection } = require("discord.js");

module.exports = (client, database, callback) => {
  let welcome, joinroles, farewell, levels, economy, suggestions, bodyToSend;
  if (database.welcomeEnabled !== 0)
    welcome =
      client.commands.filter((command) => command.module === "welcome") || [];
  if (database.farewellEnabled !== 0)
    farewell =
      client.commands.filter((command) => command.module === "farewell") || [];
  if (database.joinRolesEnabled !== 0)
    joinroles =
      client.commands.filter((command) => command.module === "joinroles") || [];
  if (database.levelsEnabled !== 0)
    levels =
      client.commands.filter((command) => command.module === "levels") || [];
  if (database.suggestionsEnabled !== 0)
    suggestions =
      client.commands.filter((command) => command.module === "suggestions") ||
      [];
  if (database.economyEnabled !== 0)
    economy =
      client.commands.filter((command) => command.module === "economy") || [];
  const nomodule = client.commands.filter((command) => !command.module);

  bodyToSend = new Collection().concat(
    welcome || [],
    joinroles || [],
    farewell || [],
    levels || [],
    economy || [],
    suggestions || [],
    nomodule || []
  );

  if (database.guildViewCnfCmdsEnabled === 0) {
    bodyToSend = bodyToSend.filter(
      (command) => command.isConfigCommand === false
    );
  }

  if (callback)
    callback(bodyToSend.map((command) => command.interactionData.toJSON()));
};
