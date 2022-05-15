const { BitField } = require('discord.js')
const { importarDatosDelServidorEnFormatoYAML } = require('../../core/guildManager')
const { plantillas } = require('../../core/messageManager')

const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'import',
  cooldown: 1000,
  permissions: [BitField.Flags.ManageGuild],
  isConfigurationCommand: true,
  runInteraction (interaction) {
    interaction.editReply({ embeds: [plantillas.informacion(i18n.getTranslation(interaction.preferredLocale, 'YAMLCONFIGURATION_IMPORT_NOTSUPPORTED'))] })
  },
  runCommand (message) {
    if (message.attachments.first()) {
      importarDatosDelServidorEnFormatoYAML(message.guild, message.attachments.first().url, (err) => {
        if (err) return message.reply({ embeds: [plantillas.errorLog(i18n.getTranslation(message.preferredLocale, 'YAMLCONFIGURATION_IMPORT_ERROR'), err)] })
        message.reply({ embeds: [plantillas.conexito(i18n.getTranslation(message.preferredLocale, 'YAMLCONFIGURATION_IMPORT_SUCCESS'))] })
      })
    } else {
      message.reply({ embeds: [plantillas.error(i18n.getTranslation(message.preferredLocale, 'YAMLCONFIGURATION_IMPORT_FILENOTPROVIDED'))] })
    }
  }
}
