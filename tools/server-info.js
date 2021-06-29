module.exports = {
    name: 'server-info',
    execute(args, canvacord, client, con, Sentry, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
                const members = message.guild.members.cache;
                const channels = message.guild.channels.cache;
                const emojis = message.guild.emojis.cache;
                const filterLevels = {
                    DISABLED: 'Off',
                    MEMBERS_WITHOUT_ROLES: 'No Role',
                    ALL_MEMBERS: 'Everyone'
                };

                const verificationLevels = {
                    NONE: 'None',
                    LOW: 'Low',
                    MEDIUM: 'Medium',
                    HIGH: '(╯°□°）╯︵ ┻━┻',
                    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
                };

                const regions = {
                    brazil: 'Brazil',
                    europe: 'Europe',
                    hongkong: 'Hong Kong',
                    india: 'India',
                    japan: 'Japan',
                    russia: 'Russia',
                    singapore: 'Singapore',
                    southafrica: 'South Africa',
                    sydeny: 'Sydeny',
                    'us-central': 'US Central',
                    'us-east': 'US East',
                    'us-west': 'US West',
                    'us-south': 'US South'
                };
                const embed = new MessageEmbed()
                    .setDescription(`**Server Info**`)
                    .setColor('BLACK')
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .addField('General', [
                        `**Nombre:** ${message.guild.name}`,
                        `**ID:** ${message.guild.id}`,
                        `**Dueño:** ${message.guild.owner.user.tag} (${message.guild.ownerID})`,
                        `**Región:** ${regions[message.guild.region]}`,
                        `**Nivel de boost:** ${message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : 'None'}`,
                        `**Filtro:** ${filterLevels[message.guild.explicitContentFilter]}`,
                        `**Nivel de verificación:** ${verificationLevels[message.guild.verificationLevel]}`,
                        `**Fecha de creación:** ${moment(message.guild.createdTimestamp).format('LT')} ${moment(message.guild.createdTimestamp).format('LL')} [${moment(message.guild.createdTimestamp).fromNow()}]`,
                        '\u200b'
                    ])
                    .addField('Estadísticas', [
                        `**Cantidad de roles:** ${roles.length}`,
                        `**Cantidad de custom emojis:** ${emojis.size}`,
                        `**Cantidad de emojis estáticos:** ${emojis.filter(emoji => !emoji.animated).size}`,
                        `**Cantidad de emojis animados:** ${emojis.filter(emoji => emoji.animated).size}`,
                        `**Cantidad de miembros:** ${message.guild.memberCount}`,
                        `**Humanos:** ${members.filter(member => !member.user.bot).size}`,
                        `**Bots:** ${members.filter(member => member.user.bot).size}`,
                        `**Canales de texto:** ${channels.filter(channel => channel.type === 'text').size}`,
                        `**Canales de voz:** ${channels.filter(channel => channel.type === 'voice').size}`,
                        `**Cantidad de boost:** ${message.guild.premiumSubscriptionCount || '0'}`,
                        '\u200b'
                    ])
                    .addField('Actividad', [
                        `**En Línea:** ${members.filter(member => member.presence.status === 'online').size}`,
                        `**Ausente:** ${members.filter(member => member.presence.status === 'idle').size}`,
                        `**No Molestar:** ${members.filter(member => member.presence.status === 'dnd').size}`,
                        `**Desconectado:** ${members.filter(member => member.presence.status === 'offline').size}`,
                        '\u200b'
                    ])
                    .addField(`Roles [${roles.length - 1}]`, roles.join(', '))

                    .setTimestamp();
                message.channel.send(embed);
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}