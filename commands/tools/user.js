const { MessageEmbed } = require("discord.js");
const i18n = require("../../i18n/i18n");
const unixTime = require("unix-time");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "user",
  description: "👪 Shows information about an user",
  cooldown: 1,
  interactionData: new SlashCommandBuilder()
    .setName("user")
    .setDescription("👪 Shows information about an user")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to get information about.")
    ),
  executeInteraction(client, locale, interaction) {
    const embed = new MessageEmbed()
      .setFooter({
        text: "Powered by Pingu",
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    if (interaction.options.getUser("user")) {
      embed
        .setTitle(
          i18n(locale, "USER::EMBED:TITLE", {
            USER: interaction.options.getUser("user").tag,
          })
        )
        .setColor(interaction.options.getUser("user").hexAccentColor)
        .setThumbnail(
          interaction.options
            .getUser("user")
            .displayAvatarURL({ dynamic: true })
        )
        .setDescription(
          `:crown: **${i18n(locale, "USER::EMBED:USERTAG")}**: ${
            interaction.options.getUser("user").tag
          }\n:tada: **${i18n(locale, "USER::EMBED:MEMBERNAME")}**: ${
            interaction.options.getMember("user").displayName
          }\n:id: **${i18n(locale, "USER::EMBED:USERID")}**: ${
            interaction.options.getMember("user").id
          }\n:calendar: **${i18n(
            locale,
            "USER::EMBED:ACCOUNTCREATIONDATE"
          )}**: <t:${unixTime(
            interaction.options.getUser("user").createdTimestamp
          )}>\n:calendar: **${i18n(
            locale,
            "USER::EMBED:GUILDJOINDATE"
          )}**: <t:${unixTime(
            interaction.options.getMember("user").joinedTimestamp
          )}>`
        ); // TODO: Mostrar permisos de manera literal
      interaction.editReply({ embeds: [embed] });
    } else {
      embed
        .setTitle(
          i18n(locale, "USER::EMBED:TITLE", { USER: interaction.user.tag })
        )
        .setColor(interaction.user.hexAccentColor)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `:crown: **${i18n(locale, "USER::EMBED:USERTAG")}**: ${
            interaction.user.tag
          }\n:tada: **${i18n(locale, "USER::EMBED:MEMBERNAME")}**: ${
            interaction.member.displayName
          }\n:id: **${i18n(locale, "USER::EMBED:USERID")}**: ${
            interaction.member.id
          }\n:calendar: **${i18n(
            locale,
            "USER::EMBED:ACCOUNTCREATIONDATE"
          )}**: <t:${unixTime(
            interaction.user.createdTimestamp
          )}>\n:calendar: **${i18n(
            locale,
            "USER::EMBED:GUILDJOINDATE"
          )}**: <t:${unixTime(interaction.member.joinedTimestamp)}>`
        ); // TODO: Mostrar permisos de manera literal
      interaction.editReply({ embeds: [embed] });
    }
  },
  executeLegacy(client, locale, message) {
    const embed = new MessageEmbed().setTimestamp().setFooter({
      text: "Powered by Pingu",
      iconURL: client.user.displayAvatarURL(),
    });
    if (message.mentions.users.first()) {
      message.guild.members
        .fetch(message.mentions.users.first())
        .then((member) => {
          embed
            .setTitle(
              i18n(locale, "USER::EMBED:TITLE", {
                USER: message.mentions.users.first().tag,
              })
            )
            .setColor(message.mentions.users.first().hexAccentColor)
            .setThumbnail(
              message.mentions.users.first().displayAvatarURL({ dynamic: true })
            )
            .setDescription(
              `:crown: **${i18n(locale, "USER::EMBED:USERTAG")}**: ${
                message.mentions.users.first().tag
              }\n:tada: **${i18n(locale, "USER::EMBED:MEMBERNAME")}**: ${
                member.displayName
              }\n:id: **${i18n(locale, "USER::EMBED:USERID")}**: ${
                member.id
              }\n:calendar: **${i18n(
                locale,
                "USER::EMBED:ACCOUNTCREATIONDATE"
              )}**: <t:${unixTime(
                message.mentions.users.first().createdTimestamp
              )}>\n:calendar: **${i18n(
                locale,
                "USER::EMBED:GUILDJOINDATE"
              )}**: <t:${unixTime(message.member.joinedTimestamp)}>`
            ); // TODO: Mostrar permisos de manera literal
          message.reply({ embeds: [embed] });
        });
    } else {
      embed
        .setTitle(
          i18n(locale, "USER::EMBED:TITLE", { USER: message.author.tag })
        )
        .setColor(message.author.hexAccentColor)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `:crown: **${i18n(locale, "USER::EMBED:USERTAG")}**: ${
            message.author.tag
          }\n:tada: **${i18n(locale, "USER::EMBED:MEMBERNAME")}**: ${
            message.member.displayName
          }\n:id: **${i18n(locale, "USER::EMBED:USERID")}**: ${
            message.member.id
          }\n:calendar: **${i18n(
            locale,
            "USER::EMBED:ACCOUNTCREATIONDATE"
          )}**: <t:${unixTime(
            message.author.createdTimestamp
          )}>\n:calendar: **${i18n(
            locale,
            "USER::EMBED:GUILDJOINDATE"
          )}**: <t:${unixTime(message.member.joinedTimestamp)}>`
        ); // TODO: Mostrar permisos de manera literal
      message.reply({ embeds: [embed] });
    }
  },
};
