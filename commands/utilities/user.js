const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const unixTime = require('unix-time')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  name: 'user',
  description: '👪 Shows information about an user',
  interaction: new SlashCommandBuilder()
    .setName('user')
    .setDescription('👪 Shows information about an user')
    .addUserOption(option => option.setName('user').setDescription('User to get information about.')),
  runInteraction (interaction) {
    const embed = new MessageEmbed()
      .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })
      .setTimestamp()

    if (interaction.options.getUser('user')) {
      embed
        .setTitle(i18n(interaction.guild.preferredLocale, 'USER::EMBED:TITLE', { USER: interaction.options.getUser('user').tag }))
        .setColor('#FFFFFF')
        .setThumbnail(interaction.options.getUser('user').displayAvatarURL({ dynamic: true }))
        .setDescription(`:crown: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:USERTAG')}**: ${interaction.options.getUser('user').tag}\n:tada: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:MEMBERNAME')}**: ${interaction.options.getMember('user').displayName}\n:id: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:USERID')}**: ${interaction.options.getMember('user').id}\n:calendar: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:ACCOUNTCREATIONDATE')}**: <t:${unixTime(interaction.options.getUser('user').createdTimestamp)}>\n:calendar: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:GUILDJOINDATE')}**: <t:${unixTime(interaction.options.getMember('user').joinedTimestamp)}>`)

      interaction.editReply({ embeds: [embed] })
    } else {
      embed
        .setTitle(i18n(interaction.guild.preferredLocale, 'USER::EMBED:TITLE', { USER: interaction.user.tag }))
        .setColor('#FFFFFF')
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`:crown: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:USERTAG')}**: ${interaction.user.tag}\n:tada: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:MEMBERNAME')}**: ${interaction.member.displayName}\n:id: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:USERID')}**: ${interaction.member.id}\n:calendar: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:ACCOUNTCREATIONDATE')}**: <t:${unixTime(interaction.user.createdTimestamp)}>\n:calendar: **${i18n(interaction.guild.preferredLocale, 'USER::EMBED:GUILDJOINDATE')}**: <t:${unixTime(interaction.member.joinedTimestamp)}>`)

      interaction.editReply({ embeds: [embed] })
    }
  },
  runCommand (message) {
    const embed = new MessageEmbed().setTimestamp().setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })

    if (message.mentions.users.first()) {
      message.guild.members
        .fetch(message.mentions.users.first())
        .then(member => {
          embed
            .setTitle(i18n(message.guild.preferredLocale, 'USER::EMBED:TITLE', { USER: message.mentions.users.first().tag }))
            .setColor('#FFFFFF')
            .setThumbnail(message.mentions.users.first().displayAvatarURL({ dynamic: true }))
            .setDescription(`:crown: **${i18n(message.guild.preferredLocale, 'USER::EMBED:USERTAG')}**: ${message.mentions.users.first().tag}\n:tada: **${i18n(message.guild.preferredLocale, 'USER::EMBED:MEMBERNAME')}**: ${member.displayName}\n:id: **${i18n(message.guild.preferredLocale, 'USER::EMBED:USERID')}**: ${member.id}\n:calendar: **${i18n(message.guild.preferredLocale, 'USER::EMBED:ACCOUNTCREATIONDATE')}**: <t:${unixTime(message.mentions.users.first().createdTimestamp)}>\n:calendar: **${i18n(message.guild.preferredLocale, 'USER::EMBED:GUILDJOINDATE')}**: <t:${unixTime(message.member.joinedTimestamp)}>`)

          message.reply({ embeds: [embed] })
        })
    } else {
      embed
        .setTitle(i18n(message.guild.preferredLocale, 'USER::EMBED:TITLE', { USER: message.author.tag }))
        .setColor('#FFFFFF')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`:crown: **${i18n(message.guild.preferredLocale, 'USER::EMBED:USERTAG')}**: ${message.author.tag}\n:tada: **${i18n(message.guild.preferredLocale, 'USER::EMBED:MEMBERNAME')}**: ${message.member.displayName}\n:id: **${i18n(message.guild.preferredLocale, 'USER::EMBED:USERID')}**: ${message.member.id}\n:calendar: **${i18n(message.guild.preferredLocale, 'USER::EMBED:ACCOUNTCREATIONDATE')}**: <t:${unixTime(message.author.createdTimestamp)}>\n:calendar: **${i18n(message.guild.preferredLocale, 'USER::EMBED:GUILDJOINDATE')}**: <t:${unixTime(message.member.joinedTimestamp)}>`)

      message.reply({ embeds: [embed] })
    }
  }
}
