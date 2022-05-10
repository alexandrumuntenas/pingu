const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions, MessageEmbed, BitField, Attachment } = require('discord.js')
const { subirInteraccionesDelServidor, actualizarConfiguracionDelServidor, guardarDatosDelServidorEnFormatoYAML, exportarDatosDelServidorEnFormatoYAML } = require('../../core/guildManager')
const { plantillas } = require('../../core/messageManager')
const { modulosDisponibles } = require('../../core/moduleManager')

const i18n = require('../../core/i18nManager')
const Consolex = require('../../core/consolex')
const avaliableModules = []

modulosDisponibles.forEach(modulo => avaliableModules.push({ name: modulo, value: modulo }))

module.exports = {
  name: 'bot',
  description: 'BOT::HELP:DESCRIPTION',
  cooldown: 1000,
  permissions: [BitField.Flags.ManageGuild],
  isConfigurationCommand: true,
  interaction: new SlashCommandBuilder()
    .addSubcommand(sc => sc.setName('export').setDescription('📩 Export the bot configuration to a YAML file.')),
  runInteraction(interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'export': {
        exportarDatosDelServidorEnFormatoYAML(interaction.guild, (attachmentPath) => {
          interaction.editReply({ files: [new Attachment(attachmentPath, `${interaction.guild.name}_${interaction.guild.id}.yml`)] })
        })
      }
    }
  },
  runCommand(message) {
    exportarDatosDelServidorEnFormatoYAML(message.guild, (attachmentPath) => {
      message.reply({ files: [new Attachment(attachmentPath, `${message.guild.name}_${message.guild.id}.yml`)] })
    })
  }
}
