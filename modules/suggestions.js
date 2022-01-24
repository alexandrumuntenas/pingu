/* eslint-disable node/no-callback-literal */
/*
 * Suggestions Module
 * Avaliable methods: createSuggestion, deleteSuggestion, getSuggestions, getSuggestion, approveSuggestion, rejectSuggestion
 * Released on 22T1 (Snapshot 2112)
 */

/**
 * Creates a new suggestion
 * @param {Client} client The base client for interacting with the Discord API
 * @param {Object} suggestion 'suggestion' object. Needs the following parameters: 'suggestionContent', 'suggestionAuthor' (only ID), 'suggestionGuild' (only ID), 'suggestionMessage' (only ID) (refers to the message that the bot sent when it was creating the suggestion)
 * @return {String} Suggestion ID
 */

module.exports.createSuggestion = async (client, suggestion, callback) => {
  client.pool.query(
    "INSERT INTO `guildSuggestions` (`suggestionId`, `suggestionGuild`, `suggestionAuthor`, `suggestionContent`, `suggestionMessageId`) VALUES (?, ?, ?, ?, ?)",
    [
      suggestion.suggestionId,
      suggestion.suggestionGuild,
      suggestion.suggestionAuthor,
      suggestion.suggestionContent,
      suggestion.suggestionMessage,
    ],
    (err) => {
      if (err) client.logError(err);
      if (err) return callback(500);
      return callback(200);
    }
  );
};

/**
 * Deletes a suggestion
 * @param {Client} client The base client for interacting with the Discord API
 * @param {Object} suggestion 'suggestion' object. Needs the following parameters: 'suggestionId', 'suggestionGuild' (only ID)
 * @return {Int} Status || 200 = Success || 500 = Error
 */

module.exports.deleteSuggestion = async (client, suggestion, callback) => {
  client.pool.query(
    "DELETE FROM `guildSuggestions` WHERE suggestionGuild = ? AND suggestionId = ?",
    [suggestion.suggestionGuild, suggestion.suggestionId],
    (err) => {
      if (err) client.logError(err);
      if (err) return callback(500);
      return callback(200);
    }
  );
};

/**
 * Gets all the suggestions of a guild
 * @param {Client} client The base client for interacting with the Discord API
 * @param {GuildManager} guild The guild to get the suggestions of
 * @return {String} Suggestion ID
 */

module.exports.getSuggestions = async (client, guild, callback) => {
  client.pool.query(
    "SELECT * FROM `guildSuggestions` WHERE suggestionGuild = ?",
    [guild.suggestionId],
    (err, rows) => {
      if (err) client.logError(err);
      if (err) return callback(500);
      return callback(200);
    }
  );
};

/**
 * Get a concrete suggestion from guild database
 * @param {Client} client The base client for interacting with the Discord API
 * @param {Object} suggestion 'suggestion' object. Needs the following parameters: 'suggestionId', 'suggestionGuild' (only ID)
 * @return {Int} Status || 200 = Success || 500 = Error || 404 = Not Found
 */

module.exports.getSuggestion = async (client, suggestion, callback) => {
  client.pool.query(
    "SELECT * FROM `guildSuggestions` WHERE suggestionGuild = ? AND suggestionId = ?",
    [suggestion.suggestionGuild, suggestion.suggestionId],
    (err, result) => {
      if (err) client.logError(err);
      if (err) return callback(500);
      if (result && Object.prototype.hasOwnProperty.call(result, 0))
        return callback(result[0]);
      return callback(404);
    }
  );
};

/**
 * Approve a suggestion
 * @param {Client} client The base client for interacting with the Discord API
 * @param {Object} suggestion 'suggestion' object. Needs the following parameters: 'suggestionId', 'suggestionGuild' (only ID), 'suggestionRevisor' (only member ID)
 * @return {Int} Status || 200 = Success || 500 = Error || 404 = Not Found
 */

module.exports.approveSuggestion = async (client, suggestion, callback) => {
  module.exports.getSuggestion(
    client,
    {
      suggestionId: suggestion.suggestionId,
      suggestionGuild: suggestion.suggestionGuild,
    },
    (data) => {
      if (Object.prototype.hasOwnProperty.call(data, "suggestionId")) {
        client.pool.query(
          "UPDATE `guildSuggestions` SET `suggestionStatus` = ?, `suggestionRevisor` = ? WHERE `suggestionId` = ? AND suggestionGuild = ?",
          [
            "2",
            suggestion.suggestionRevisor,
            suggestion.suggestionId,
            suggestion.suggestionGuild,
          ],
          (err) => {
            if (err) client.logError(err);
            if (err) return callback(500);
            return callback(data);
          }
        );
      } else if (data === 500) {
        return callback(500);
      } else {
        return callback(404);
      }
    }
  );
};

/**
 * Reject a suggestion
 * @param {Client} client The base client for interacting with the Discord API
 * @param {Object} suggestion 'suggestion' object. Needs the following parameters: 'suggestionId', 'suggestionGuild' (only ID), 'suggestionRevisor' (only member ID)
 * @return {Int} Status || 200 = Success || 500 = Error || 404 = Not Found
 */

module.exports.rejectSuggestion = async (client, suggestion, callback) => {
  module.exports.getSuggestion(
    client,
    {
      suggestionId: suggestion.suggestionId,
      suggestionGuild: suggestion.suggestionGuild,
    },
    (data) => {
      if (Object.prototype.hasOwnProperty.call(data, "suggestionId")) {
        client.pool.query(
          "UPDATE `guildSuggestions` SET `suggestionStatus` = ?, `suggestionRevisor` = ? WHERE `suggestionId` = ? AND suggestionGuild = ?",
          [
            "1",
            suggestion.suggestionRevisor,
            suggestion.suggestionId,
            suggestion.suggestionGuild,
          ],
          (err) => {
            if (err) client.logError(err);
            if (err) return callback(500);
            return callback(data);
          }
        );
      } else if (data === 500) {
        return callback(500);
      } else {
        return callback(404);
      }
    }
  );
};
