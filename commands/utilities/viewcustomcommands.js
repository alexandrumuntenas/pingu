const { getCustomCommands } = require('../../modules/customcommands')
const { MessageEmbed } = require('discord.js')
const i18n = require('../../i18n/i18n')
const { status } = require('../../functions/defaultMessages')

module.exports = {
  name: 'viewcustomcommands',
  description: 'View the custom commands of your server',
  module: 'customcommands',
  runInteraction (locale, interaction) {
    getCustomCommands(interaction.guild, customcommands => {
      if (customcommands.length === 0) {
        interaction.editReply({ embeds: [status(i18n(locale, 'VIEWCUSTOMCOMMANDS::NOCUSTOMCOMMANDS'))] })
      } else {
        const embed = new MessageEmbed()
          .setColor('#2F3136')
          .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
          .setTitle(i18n(locale, 'VIEWCUSTOMCOMMANDS::TITLE'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })

        let customcommandsList = ''
        for (let i = 0; i < customcommands.length; i++) {
          customcommandsList = `${customcommandsList}\`${customcommands[i].command}\` `
        }

        interaction.editReply({ embeds: [embed.setDescription(customcommandsList)] })
      }
    })
  },
  runCommand (locale, message) {
    getCustomCommands(message.guild, customcommands => {
      if (customcommands.length === 0) {
        message.reply({ embeds: [status(i18n(locale, 'VIEWCUSTOMCOMMANDS::NOCUSTOMCOMMANDS'))] })
      } else {
        const embed = new MessageEmbed()
          .setColor('#2F3136')
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
          .setTitle(i18n(locale, 'VIEWCUSTOMCOMMANDS::TITLE'))
          .setFooter({ text: 'Powered by Pingu', iconURL: process.Client.user.displayAvatarURL() })

        let customcommandsList = ''
        for (let i = 0; i < customcommands.length; i++) {
          customcommandsList = `${customcommandsList}\`${customcommands[i].command}\` `
        }

        message.reply({ embeds: [embed.setDescription(customcommandsList)] })
      }
    })
  }
}
