import Consolex from '../core/consolex';
import EventHook from '../core/classes/EventHook';
import AutoReply from './classes/AutoReply';
import Module from '../core/classes/Module';
import { Guild, EmbedBuilder } from 'discord.js';
import { ClientUser } from '../client';
import { PoolConnection } from '../core/databaseManager';
function autoReplyFromDatabase(databaseAutoReply) {
    return new AutoReply(databaseAutoReply.guild, {
        desencadenante: databaseAutoReply.autoreplyTrigger,
        propiedades: JSON.parse(databaseAutoReply.autoreplyProperties)
    });
}
async function obtenerRespuestaPersonalizada(guild, desencadenante) {
    if (!(guild instanceof Guild))
        throw new Error('El "Guild especificado no existe.');
    const autoReply = await PoolConnection.execute('SELECT * FROM `guildAutoReply` WHERE `autoreplyTrigger` LIKE ? AND `guild` = ? LIMIT 1', [desencadenante.toLowerCase(), guild.id])
        .then((result) => result[0])
        .catch((err) => Consolex.gestionarError(err));
    return autoReplyFromDatabase(autoReply);
}
function messageCreateHook(message) {
    obtenerRespuestaPersonalizada(message.guild, message.content).then((autoReply) => {
        if (autoReply) {
            const reply = { embeds: [], content: '' };
            if (autoReply.propiedades.enviarEnEmbed.habilitado) {
                const embed = new EmbedBuilder();
                if (autoReply.propiedades.enviarEnEmbed.titulo) {
                    embed.setTitle(autoReply.propiedades.enviarEnEmbed.titulo);
                }
                if (autoReply.propiedades.enviarEnEmbed.descripcion) {
                    embed.setDescription(autoReply.propiedades.enviarEnEmbed.descripcion);
                }
                else
                    embed.setDescription(autoReply.propiedades.respuesta);
                if (autoReply.propiedades.enviarEnEmbed.thumbnail) {
                    embed.setThumbnail(autoReply.propiedades.enviarEnEmbed.thumbnail);
                }
                if (autoReply.propiedades.enviarEnEmbed.imagen) {
                    embed.setImage(autoReply.propiedades.enviarEnEmbed.imagen);
                }
                if (autoReply.propiedades.enviarEnEmbed.url) {
                    embed.setURL(autoReply.propiedades.enviarEnEmbed.url);
                }
                embed.setFooter({ text: 'Powered by Pingu || ⚠️ This is an autoreply made by this server.', iconURL: ClientUser.user?.displayAvatarURL() });
                reply.embeds.push(embed);
            }
            else
                reply.content = autoReply.propiedades.respuesta;
            try {
                message.channel.send(reply);
            }
            catch (err) {
                Consolex.gestionarError(err);
            }
        }
    }).catch((enviarRespuestaPersonalizadaError) => Consolex.gestionarError(enviarRespuestaPersonalizadaError));
}
export default new Module('AutoReply', 'Automatic customizable replies', [new EventHook('messageCreate', messageCreateHook, 'noPrefix')], { enabled: 'boolean' }, { enabled: false });
