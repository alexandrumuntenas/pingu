const moment = require('moment');
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'server-info',
    execute(args, client, con, contenido, global, message, result) {
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
            brazil: ':flag_br: Brazil',
            europe: ':flag_eu: Europe',
            hongkong: ':flag_hk: Hong Kong',
            india: ':flag_in: India',
            japan: ':flag_jp: Japan',
            russia: ':flag_ru: Russia',
            singapore: ':flag_sg: Singapore',
            southafrica: ':flag_za: South Africa',
            sydeny: ':flag_au: Sydeny',
            'us-central': ':flag_us: US Central',
            'us-east': ':flag_us: US East',
            'us-west': ':flag_us: US West',
            'us-south': ':flag_us: US South'
        };
        const embed = new MessageEmbed()
            .setDescription(`**Server Info**`)
            .setColor('#FFFFFF')
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
            ], false)
            .addField('Estadísticas', [
                `**<:roles:868216667858174013> Cantidad de roles:** ${roles.length}`,
                `**:goat: Cantidad de custom emojis:** ${emojis.size}`,
                `**:speech_balloon: Cantidad de emojis estáticos:** ${emojis.filter(emoji => !emoji.animated).size}`,
                `**<a:custom_emoji:868217323075559495> Cantidad de emojis animados:** ${emojis.filter(emoji => emoji.animated).size}`,
                `**:family: Cantidad de miembros:** ${message.guild.memberCount}`,
                `**:person_doing_cartwheel: Humanos:** ${members.filter(member => !member.user.bot).size}`,
                `**<:bot:868216442766647368> Bots:** ${members.filter(member => member.user.bot).size}`,
                `**<:textchannel:868216343659417790> Canales de texto:** ${channels.filter(channel => channel.type === 'text').size}`,
                `**<:voicechannel:868216167955828776> Canales de voz:** ${channels.filter(channel => channel.type === 'voice').size}`,
                `**<a:nitro_boost:868214436178046976> Cantidad de boost:** ${message.guild.premiumSubscriptionCount || '0'}`,
            ], true)
            .addField('Actividad', [
                `**<:online:868213340894298112> En Línea:** ${members.filter(member => member.presence.status === 'online').size}`,
                `**<:idle:868213497731891261> Ausente:** ${members.filter(member => member.presence.status === 'idle').size}`,
                `**<:dnd:868213585136980079> No Molestar:** ${members.filter(member => member.presence.status === 'dnd').size}`,
                `**<:offline:868213543441403954> Desconectado:** ${members.filter(member => member.presence.status === 'offline').size}`,
            ], true)
            .addField(`Roles [${roles.length - 1}]`, roles.join(', '), false)

            .setTimestamp();
        message.channel.send(embed);
    }
}