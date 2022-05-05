const { EmbedBuilder, PermissionsBitField } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'embed',
  description: '📝 Create an embed message',
  permissions: [PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers],
  interaction: new SlashCommandBuilder()
    .addStringOption(option => option.setName('title').setDescription('Sets the embed title. (256 characters max)').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Sets the embed description. (4096 characters max)').setRequired(true))
    .addStringOption(option => option.setName('footer').setDescription('Sets the embed footer. (2048 characters max)'))
    .addStringOption(option => option.setName('thumbnail').setDescription('Adds an image/gif to the upper-right corner of your embed. (Use a direct media link.)'))
    .addStringOption(option => option.setName('image').setDescription('Adds an image/gif to the bottom of your embed. (Use a direct media link.)')),
  runInteraction (interaction) {
    const title = interaction.options.getString('title')
    const description = interaction.options.getString('description')
    const footer = interaction.options.getString('footer')
    const thumbnail = interaction.options.getString('thumbnail')
    const image = interaction.options.getString('image')

    const embed = new EmbedBuilder()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
      .setTitle(title)
      .setDescription(description)
      .setColor('#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16)))
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()
    if (footer) embed.setFooter({ text: footer })
    if (thumbnail) embed.setThumbnail(thumbnail)
    if (image) embed.setImage(image)

    interaction.editReply({ embeds: [embed] })
  }
}
