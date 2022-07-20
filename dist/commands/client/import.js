import { PermissionsBitField } from 'discord.js';
import { ClientGuildManager, ClientInternationalizationManager, ClientMessageTemplate } from '../../client.js';
import Command from '../../core/classes/Command.js';
export default new Command({
    name: 'import',
    description: 'Importar la configuración de un servidor',
    permissions: [PermissionsBitField.Flags.ManageGuild],
    runCommand: (message) => {
        if (message.attachments.first()) {
            ClientGuildManager.importarConfiguracionDelServidor(message.guild, message.attachments.first()?.url).then((importLog) => {
                message.reply({ embeds: [ClientMessageTemplate.success(ClientInternationalizationManager.obtenerTraduccion({ clave: 'THE_CONFIGURATION_FILE_HAS_BEEN_IMPORTED_CORRECTLY', idioma: message.guild?.preferredLocale }), importLog)] });
            }).catch((error) => {
                message.reply({ embeds: [ClientMessageTemplate.error(ClientInternationalizationManager.obtenerTraduccion({ clave: 'AN_ERROR_OCCURRED_WHEN_IMPORTING_THE_SETTINGS_FILE', idioma: message.guild?.preferredLocale }), error)] });
            });
        }
        else {
            message.reply({ embeds: [ClientMessageTemplate.error(ClientInternationalizationManager.obtenerTraduccion({ clave: 'NO_YAML_FILE_SPECIFIED_FOR_IMPORT', idioma: message.guild?.preferredLocale }))] });
        }
    }
});
