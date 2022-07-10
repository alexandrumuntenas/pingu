import { AttachmentBuilder, PermissionsBitField } from 'discord.js'
import { ClientGuildManager, ClientMessageTemplate } from '../../client'
import Command from '../../core/classes/Command'
import Consolex from '../../core/consolex'
import { obtenerTraduccion } from '../../core/i18nManager'

export default new Command({
  name: 'export',
  description: 'Exportar la configuración de un servidor',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  runCommand: (message) => {
    ClientGuildManager.exportarConfiguracionDelServidor(message.guild).then((rutaLocalDelArchivo) => {
      message.reply({ embeds: [ClientMessageTemplate.info(obtenerTraduccion('YAMLCONFIGURATION_EXPORT_INFORMATION', message.guild?.preferredLocale))], files: [new AttachmentBuilder(rutaLocalDelArchivo, { name: `${message.guild?.id}_configuration.yaml` })] })
    }).catch((exportarConfiguracionDelServidorError) => Consolex.gestionarError(exportarConfiguracionDelServidorError))
  }
})
