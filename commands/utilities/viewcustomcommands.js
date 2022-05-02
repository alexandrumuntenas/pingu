const { getCustomCommands } = require('../../modules/customcommands')
const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { plantillas } = require('../../functions/messageManager')

module.exports = {
  name: 'viewcustomcommands',
  description: 'View the custom commands of your server',
  module: 'customcommands',
  runInteraction (interaction) {
    getCustomCommands(interaction.guild, customcommands => {
      if (customcommands.length === 0) return interaction.editReply({ embeds: [plantillas.estado(i18n(guild.preferredLocale, 'VIEWCUSTOMCOMMANDS::NOCUSTOMCOMMANDS'))] })

      const embed = new MessageEmbed()
        .setColor('#2F3136')
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
        .setTitle(i18n(guild.preferredLocale, 'VIEWCUSTOMCOMMANDS::TITLE'))
        .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })

      let customcommandsList = ''

      for (let i = 0; i < customcommands.length; i++) {
        customcommandsList = `${customcommandsList}\`${customcommands[i].command}\` `
      }

      interaction.editReply({ embeds: [embed.setDescription(customcommandsList)] })
    })
  },
  runCommand (message) {
    getCustomCommands(message.guild, customcommands => {
      if (customcommands.length === 0) return message.reply({ embeds: [plantillas.estado(i18n(message.guild.preferredLocale, 'VIEWCUSTOMCOMMANDS::NOCUSTOMCOMMANDS'))] })

      const embed = new MessageEmbed()
        .setColor('#2F3136')
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
        .setTitle(i18n(message.guild.preferredLocale, 'VIEWCUSTOMCOMMANDS::TITLE'))
        .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })

      let customcommandsList = ''

      for (let i = 0; i < customcommands.length; i++) {
        customcommandsList = `${customcommandsList}\`${customcommands[i].command}\` `
      }

      message.reply({ embeds: [embed.setDescription(customcommandsList)] })
    })
  }
}
