module.exports = {
    name: 'unlock',
    execute(args, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.overwritePermissions(role, { 'SEND_MESSAGES': true })
            message.channel.send(':white_check_mark: El canal ha sido desbloqueado. Ya se pueden enviar mensajes.')
        }
    }
}