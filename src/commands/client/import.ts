import { PermissionsBitField } from 'discord.js'
import { ClientGuildManager, ClientMessageTemplate } from '../../client'
import { obtenerTraduccion } from '../../core/i18nManager'
import Command from '../../core/classes/Command'

export default new Command({
  name: 'import',
  description: 'Importar la configuración de un servidor',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  runCommand: (message) => {
    if (message.attachments.first()) {
      ClientGuildManager.importarConfiguracionDelServidor(message.guild, message.attachments.first()?.url).then(() => {
        message.reply({ embeds: [ClientMessageTemplate.success(obtenerTraduccion('YAMLCONFIGURATION_IMPORT_SUCCESS', message.guild?.preferredLocale))] })
      }).catch((error) => {
        message.reply({ embeds: [ClientMessageTemplate.error(obtenerTraduccion('YAMLCONFIGURATION_IMPORT_ERROR', message.guild?.preferredLocale), error)] })
      })
    } else {
      message.reply({ embeds: [ClientMessageTemplate.error(obtenerTraduccion('YAMLCONFIGURATION_IMPORT_FILENOTPROVIDED', message.guild?.preferredLocale))] })
    }
  }
})
