import { AttachmentBuilder, PermissionsBitField } from 'discord.js'
import { ClientGuildManager, ClientInternationalizationManager, ClientMessageTemplate } from '../../client.js'
import Command from '../../core/classes/Command.js'
import Consolex from '../../core/consolex.js'

export default new Command({
  name: 'export',
  description: 'Exportar la configuración de un servidor',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  runCommand: (message) => {
    ClientGuildManager.exportarConfiguracionDelServidor(message.guild).then((rutaLocalDelArchivo) => {
      message.reply({ embeds: [ClientMessageTemplate.info(ClientInternationalizationManager.obtenerTraduccion({ clave: 'AQUI_TIENES_EL_ARCHIVO_DE_CONFIGURACION_DE_TU_SERVIDOR', idioma: message.guild?.preferredLocale }))], files: [new AttachmentBuilder(rutaLocalDelArchivo, { name: `${message.guild?.id}_configuration.yaml` })] })
    }).catch((exportarConfiguracionDelServidorError) => Consolex.gestionarError(exportarConfiguracionDelServidorError))
  }
})
