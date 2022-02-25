module.exports = function (message) {
    if (!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.hasPermission('KICK_MEMBERS') && !message.member.hasPermission('BAN_MEMBERS') || !message.member.hasPermission('ADMINISTRATOR')) {
        if (message.content.includes('discord.gg/' || 'discordapp.com/invite/')) { //if it contains an invite link
            message.delete();
            message.channel.send(':x: **Los enlaces de invitación no están permitidos en este servidor**')
        }
    }
}