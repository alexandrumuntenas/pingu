const { BitField, Attachment } = require('discord.js')
const { exportarDatosDelServidorEnFormatoYAML } = require('../../core/guildManager')
const { plantillas } = require('../../core/messageManager')

const i18n = require('../../core/i18nManager')

module.exports = {
  name: 'export',
  cooldown: 1000,
  permissions: [BitField.Flags.ManageGuild],
  isConfigurationCommand: true,
  runCommand (message) {
    exportarDatosDelServidorEnFormatoYAML(message.guild, rutaLocalDelArchivo => {
      message.reply({ embeds: [plantillas.informacion(i18n.obtenerTraduccion(message.preferredLocale, 'YAMLCONFIGURATION_EXPORT_INFORMATION'))], files: [new Attachment(rutaLocalDelArchivo, `${message.guild}_${message.guild.id}.yaml`)] })
    })
  }
}
