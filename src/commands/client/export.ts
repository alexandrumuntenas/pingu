import { AttachmentBuilder, PermissionsBitField } from 'discord.js'
import { ClientGuildManager, ClientMessageTemplate } from '../../client'
import { obtenerTraduccion } from '../../core/i18nManager'
import Command from '../../classes/Command'

export default new Command({
  name: 'export',
  description: 'Exportar la configuración de un servidor',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  runCommand: (message) => {
    ClientGuildManager.exportarConfiguracionDelServidor(message.guild).then((rutaLocalDelArchivo) => {
      message.reply({ embeds: [ClientMessageTemplate.info(obtenerTraduccion('YAMLCONFIGURATION_EXPORT_INFORMATION', message.guild?.preferredLocale))], files: [new AttachmentBuilder(`${message.guild?.id}_configuration.yaml`)] })
    })
  }
})
