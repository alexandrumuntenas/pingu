import * as humanizarTiempo from 'humanize-duration';
import { ChannelType, codeBlock } from 'discord.js';
import { ClientCommandsManager, ClientCooldownManager, ClientEventManager, ClientGuildManager, ClientInternationalizationManager, ClientMessageTemplate, ClientModuleManager, ClientUser } from '../client';
import Event from '../core/classes/Event';
import Consolex from '../core/consolex';
export default new Event('messageCreate', (message) => {
    if (message.channel.type === ChannelType.DM || message.author.bot || message.author === ClientUser.user) {
        return;
    }
    ClientGuildManager.obtenerConfiguracionDelServidor(message.guild).then((configuracionDelServidor) => {
        message.reply(codeBlock('json', JSON.stringify(configuracionDelServidor)));
        message.guildConfiguration = configuracionDelServidor;
        ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'messageCreate' }, message);
        if (message.content.startsWith(ClientUser.user?.toString() || `<@!${ClientUser.user?.id}>`) && (message.content.trim() === ClientUser.user?.toString() || message.content.trim() === `<@!${ClientUser.user?.id}>`)) {
            message.args = message.content
                .slice(ClientUser.user?.toString().length)
                .trim()
                .split(/ +/);
            message.rawCommand = message.args[0];
            message.args.shift();
            message.command = ClientCommandsManager.getCommand(message.rawCommand);
            if (ClientCooldownManager.check(message.member, message.command || { name: message.rawCommand })) {
                if (ClientCommandsManager.has(message.command?.name || message.rawCommand)) {
                    if (message.command && message.command.module && ClientModuleManager.nombresModulosDisponibles.includes(message.command.module) && !message.guildConfiguration[message.command.module].enabled) {
                        return message.reply({
                            embeds: [
                                ClientMessageTemplate.error(ClientInternationalizationManager.obtenerTraduccion({ clave: 'EL_MODULO_AL_QUE_PERTENECE_EL_COMANDO_NO_ESTA_ACTIVO', idioma: message.guild?.preferredLocale }))
                            ]
                        });
                    }
                    if (message.command?.permissions && !message.member?.permissions.has(message.command.permissions, false)) {
                        return message.reply({
                            embeds: [
                                ClientMessageTemplate.error(ClientInternationalizationManager.obtenerTraduccion({ clave: 'NO_DISPONES_DE_LOS_SUFICIENTES_PERMISOS_PARA_EJECUTAR_ESTE_COMANDO', idioma: message.guild?.preferredLocale }))
                            ]
                        });
                    }
                    ClientCooldownManager.add(message.member, message.command || { name: message.rawCommand });
                    if (message.command && Object.prototype.hasOwnProperty.call(message.command, 'runCommand') && message.command.runCommand instanceof Function) {
                        return message.command?.runCommand(message);
                    }
                    else if (message.command) {
                        return message.reply({
                            embeds: [
                                ClientMessageTemplate.error(ClientInternationalizationManager.obtenerTraduccion({ clave: 'EL_COMANDO_SOLICITADO_SOLO_ESTA_DISPONIBLE_COMO_INTERACCION', idioma: message.guild?.preferredLocale }))
                            ]
                        });
                    }
                }
                return ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'messageCreate', tipoDeFuncion: 'withPrefix' }, message);
            }
            return message.reply({ embeds: [ClientMessageTemplate.timeout(ClientInternationalizationManager.obtenerTraduccion({ clave: 'DEBE_ESPERAR_X_TIEMPO_PARA_PODER_EJECUTAR_ESTE_COMANDO', idioma: message.guild?.preferredLocale, placeholders: [humanizarTiempo(ClientCooldownManager.ttl(message.member, message.command || { name: message.rawCommand }), { round: true, language: message.guild?.preferredLocale, fallbacks: ['en'] })] }))] });
        }
        return ClientEventManager.ejecutarFuncionesDeTerceros({ evento: 'messageCreate', tipoDeFuncion: 'noPrefix' }, message);
    }).catch((err) => {
        Consolex.gestionarError(err);
    });
});
