import { GuildMember } from 'discord.js';
function reemplazarPlaceholdersConDatosReales(string, member, customplaceholders) {
    if (!(member instanceof GuildMember))
        throw new Error('El "GuildMember" especificado no existe.');
    let finalstring = string
        .replaceAll('{user}', member.toString())
        .replaceAll('{user.mention}', member.toString())
        .replaceAll('{user.name}', member.user.username)
        .replaceAll('{user.tag}', member.user.tag)
        .replaceAll('{user.id}', `${member.user.id}`)
        .replaceAll('{user.avatar_url}', member.user.displayAvatarURL({ size: 1024 }))
        .replaceAll('{member}', member.toString())
        .replaceAll('{member.mention}', member.toString())
        .replaceAll('{member.name}', member.user.username)
        .replaceAll('{member.tag}', member.user.tag)
        .replaceAll('{member.id}', `${member.user.id}`)
        .replaceAll('{member.avatar_url}', member.user.displayAvatarURL({ size: 1024 }))
        .replaceAll('{player}', member.toString())
        .replaceAll('{player.mention}', member.toString())
        .replaceAll('{player.name}', member.user.username)
        .replaceAll('{player.tag}', member.user.tag)
        .replaceAll('{player.id}', `${member.user.id}`)
        .replaceAll('{player.avatar_url}', member.user.displayAvatarURL({ size: 1024 }))
        .replaceAll('{guild}', member.guild.name)
        .replaceAll('{guild.name}', member.guild.name)
        .replaceAll('{guild.member_count}', `${member.guild.memberCount}`)
        .replaceAll('{guild.icon_url}', member.guild.iconURL({ size: 1024 }) || '')
        .replaceAll('{guild.id}', `${member.guild.id}`)
        .replaceAll('{guild.verification_level}', member.guild.verificationLevel.toString())
        .replaceAll('{server}', member.guild.name)
        .replaceAll('{server.name}', member.guild.name)
        .replaceAll('{server.member_count}', `${member.guild.memberCount}`)
        .replaceAll('{server.icon_url}', member.guild.iconURL({ size: 1024 }) || '')
        .replaceAll('{server.id}', `${member.guild.id}`)
        .replaceAll('{server.verification_level}', member.guild.verificationLevel.toString());
    if (customplaceholders && typeof (customplaceholders) === 'object') {
        for (const placeholder in customplaceholders) {
            if (Object.prototype.hasOwnProperty.call(customplaceholders, placeholder)) {
                finalstring = finalstring.replaceAll(`{${placeholder}}`, customplaceholders[placeholder]);
            }
        }
    }
    return finalstring;
}
export default reemplazarPlaceholdersConDatosReales;
