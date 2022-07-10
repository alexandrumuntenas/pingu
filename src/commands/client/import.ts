import { PermissionsBitField } from 'discord.js'
import { ClientGuildManager, ClientInternationalizationManager, ClientMessageTemplate } from '../../client'
import Command from '../../core/classes/Command'

export default new Command({
  name: 'import',
  description: 'Importar la configuración de un servidor',
  permissions: [PermissionsBitField.Flags.ManageGuild],
  runCommand: (message) => {
    if (message.attachments.first()) {
      ClientGuildManager.importarConfiguracionDelServidor(message.guild, message.attachments.first()?.url).then(() => {
        message.reply({ embeds: [ClientMessageTemplate.success(ClientInternationalizationManager.obtenerTraduccion({ clave: 'SE_HA_IMPORTADO_CORRECTAMENTE_EL_ARCHIVO_DE_CONFIGURACION', idioma: message.guild?.preferredLocale }))] })
      }).catch((error) => {
        message.reply({ embeds: [ClientMessageTemplate.error(ClientInternationalizationManager.obtenerTraduccion({ clave: 'SE_HA_PRODUCIDO_UN_ERROR_AL_IMPORTAR_EL_ARCHIVO_DE_CONFIGURACION', idioma: message.guild?.preferredLocale }), error)] })
      })
    } else {
      message.reply({ embeds: [ClientMessageTemplate.error(ClientInternationalizationManager.obtenerTraduccion({ clave: 'NO_SE_HA_ESPECIFICADO_NINGUN_ARCHIVO_YAML_PARA_IMPORTAR', idioma: message.guild?.preferredLocale }))] })
    }
  }
})
