const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions, MessageEmbed, BitField, Attachment } = require('discord.js')
const { exportarDatosDelServidorEnFormatoYAML, importarDatosDelServidorEnFormatoYAML } = require('../../core/guildManager')
const { plantillas } = require('../../core/messageManager')
const { modulosDisponibles } = require('../../core/moduleManager')

const i18n = require('../../core/i18nManager')
const Consolex = require('../../core/consolex')
const avaliableModules = []

modulosDisponibles.forEach(modulo => avaliableModules.push({ name: modulo, value: modulo }))

module.exports = {
  name: 'import',
  cooldown: 1000,
  permissions: [BitField.Flags.ManageGuild],
  isConfigurationCommand: true,
  runInteraction (interaction) {
    interaction.editReply({ embeds: [plantillas.informacion(i18n.getTranslation(interaction.preferredLocale, 'YAMLCONFIGURATION_IMPORT_NOTSUPPORTED'))] })
  },
  runCommand (message) {
    importarDatosDelServidorEnFormatoYAML(message.guild, message.attachments.first().url, (err) => {
      if (err) return message.reply({ embeds: [plantillas.error(i18n.getTranslation(message.preferredlocale, 'YAMLCONFIGURATION_IMPORT_ERROR'))] })
      message.reply({ embeds: [plantillas.success(i18n.getTranslation(message.preferredlocale, 'YAMLCONFIGURATION_IMPORT_SUCCESS'))] })
    })
  }
}
