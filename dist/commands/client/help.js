import { EmbedBuilder } from '@discordjs/builders';
import { Colors } from 'discord.js';
import { ClientBuild, ClientInternationalizationManager, ClientUser } from '../../client.js';
import Command from '../../core/classes/Command.js';
export default new Command({
    name: 'help',
    description: 'Muestra información relevante sobre el bot',
    cooldown: 1,
    runCommand(message) {
        const embed = new EmbedBuilder()
            .setColor(Colors.White)
            .setThumbnail(ClientUser.user?.displayAvatarURL() || 'https://cdn.discordapp.com/embed/avatars/5.png')
            .setDescription(ClientInternationalizationManager.obtenerTraduccion({ clave: 'RUNNING_ON_X_GUILDS', idioma: message.guild?.preferredLocale, placeholders: [ClientUser.guilds.cache.size.toString()] }))
            .addFields([
            { name: `<:system_link:967782851741351997> ${ClientInternationalizationManager.obtenerTraduccion({ clave: 'LINKS', idioma: message.guild?.preferredLocale })}`, value: `[Top.GG](https://top.gg/bot/${ClientUser.user?.id}/vote) • [Invite](https://discord.com/oauth2/authorize?client_id=${ClientUser.user?.id}&permissions=388627950679&scope=bot%20applications.commands)` },
            { name: `<:system_support:968434674634473493> ${ClientInternationalizationManager.obtenerTraduccion({ clave: 'GET_HELP', idioma: message.guild?.preferredLocale })}`, value: `[Docs](https://atheodor.muntenas.es/pingu/) • [Support Server](${process.env.GUILDSUPPORTINVITE || null})` },
            { name: `<:system_settings:968435053963145266> ${ClientInternationalizationManager.obtenerTraduccion({ clave: 'CONTRIBUTE_TO_DEVELOPMENT', idioma: message.guild?.preferredLocale })}`, value: '[Help Translating](https://gitlocalize.com/repo/7231) • [Source Code](https://github.com/amun06/pingu)' },
            { name: `<:status_online:967782470726615070> ${ClientInternationalizationManager.obtenerTraduccion({ clave: 'BOT_PING', idioma: message.guild?.preferredLocale })}`, value: `${Math.round(ClientUser.ws.ping + (Math.abs(Date.now() - message.createdTimestamp)))}ms`, inline: true },
            { name: `<:core_update:967782470525259777> ${ClientInternationalizationManager.obtenerTraduccion({ clave: 'BOT_VERSION', idioma: message.guild?.preferredLocale })}`, value: `${ClientBuild} ([View Changelog](https://atheodor.muntenas.es/pingu/changelog/${ClientBuild}))`, inline: true }
        ])
            .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user?.displayAvatarURL() || 'https://cdn.discordapp.com/embed/avatars/5.png' })
            .setTimestamp();
        message.channel.send({ embeds: [embed] });
    }
});
