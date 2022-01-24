const { MessageEmbed } = require("discord.js");
const i18n = require("../../i18n/i18n");
const { Error, Loader } = require("../../modules/constructor/messageBuilder");
const { getLeaderboard } = require("../../modules/levels");

module.exports = {
  module: "levels",
  cooldown: 10000,
  name: "levelstop",
  description: "🏅 Get the leaderboard",
  executeInteraction(client, locale, interaction) {
    if (interaction.database.levelsEnabled !== 0) {
      interaction.editReply({
        embeds: [Loader(i18n(locale, "PROCESSINGREQUEST"))],
      });
      getLeaderboard(client, interaction.guild, (members) => {
        if (members) {
          const embed = new MessageEmbed()
            .setTitle(
              `:trophy: ${i18n(locale, "RANKING")} of ${interaction.guild.name}`
            )
            .setColor("#FFD700")
            .setFooter({
              text: "Powered by Pingu",
              iconURL: client.user.displayAvatarURL(),
            });

          let leaderboardStr = "";
          let count = 0;
          members.forEach(function (row) {
            client.users.fetch(row.member).then((user) => {
              count++;
              leaderboardStr = `${leaderboardStr}\n#${count}. **${
                user.username
              }#${user.discriminator}** (${i18n(locale, "LEVEL")}: ${
                row.lvlLevel
              }, ${i18n(locale, "EXPERIENCE")} ${row.lvlExperience}) `;
              if (count === members.length) {
                interaction.editReply({
                  embeds: [embed.setDescription(leaderboardStr)],
                });
              }
            });
          });
        }
      });
    } else {
      interaction.editReply({
        embeds: [Error(locale, "COMMAND::NOAVALIABLE")],
      });
    }
  },
  executeLegacy(client, locale, message) {
    if (message.database.levelsEnabled !== 0) {
      message
        .reply({ embeds: [Loader(i18n(locale, "PROCESSINGREQUEST"))] })
        .then((_message) => {
          getLeaderboard(client, message.guild, (members) => {
            if (members) {
              const embed = new MessageEmbed()
                .setTitle(`:trophy: ${i18n(locale, "RANKING")} TOP 25`)
                .setColor("#FFD700")
                .setFooter({
                  text: "Powered by Pingu",
                  iconURL: client.user.displayAvatarURL(),
                });

              let leaderboardStr = "";
              let count = 0;
              members.forEach(function (row) {
                client.users.fetch(row.member).then((user) => {
                  count++;
                  leaderboardStr = `${leaderboardStr}\n#${count}. **${
                    user.username
                  }#${user.discriminator}** (${i18n(locale, "LEVEL")}: ${
                    row.lvlLevel
                  }, ${i18n(locale, "EXPERIENCE")} ${row.lvlExperience}) `;
                  if (count === members.length) {
                    _message.edit({
                      embeds: [embed.setDescription(leaderboardStr)],
                    });
                  }
                });
              });
            }
          });
        });
    } else {
      message.reply({ embeds: [Error(locale, "COMMAND::NOAVALIABLE")] });
    }
  },
};
