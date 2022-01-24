const { MessageEmbed, Permissions } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "embed",
  description: "📝 Create an embed message",
  permissions: [
    Permissions.FLAGS.MANAGE_MESSAGES,
    Permissions.FLAGS.KICK_MEMBERS,
    Permissions.FLAGS.BAN_MEMBERS,
  ],
  cooldown: 1,
  ephemeral: true,
  interactionData: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("📝 Create an embed message")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Sets the embed title. (256 characters max)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Sets the embed description. (4096 characters max)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("footer")
        .setDescription("Sets the embed footer. (2048 characters max)")
    )
    .addStringOption((option) =>
      option
        .setName("thumbnail")
        .setDescription(
          "Adds an image/gif to the upper-right corner of your embed. (Use a direct media link.)"
        )
    )
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription(
          "Adds an image/gif to the bottom of your embed. (Use a direct media link.)"
        )
    ),
  executeInteraction(client, locale, interaction) {
    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const footer = interaction.options.getString("footer");
    const thumbnail = interaction.options.getString("thumbnail");
    const image = interaction.options.getString("image");

    const embed = new MessageEmbed()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL(),
      })
      .setTitle(title)
      .setDescription(description)
      .setColor(
        "#000000".replace(/0/g, function () {
          return (~~(Math.random() * 16)).toString(16);
        })
      );
    if (footer) embed.setFooter({ text: footer });
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (image) embed.setImage(image);
    interaction.editReply({ embeds: [embed] });
  },
};
