module.exports = {
    name: 'slowmode',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.member.hasPermission('MANAGE_MESSAGES') && message.member.hasPermission('KICK_MEMBERS') && message.member.hasPermission('BAN_MEMBERS') || message.member.hasPermission('ADMINISTRATOR')) {
            if (result[0].moderador_activado != 0) {
                message.reply(' este comando se encuentra en construcción.');
                /*if (message.mentions.channels.first() && !args[2]) {
                    var ratelimit = 0;
                } else if (!args[1]) {
                    var ratelimit = 0;
                }
                if (message.mentions.channels.first()) {
                    message.channel.setRateLimitPerUser(ratelimit, "Slowmode");
                    message.reply(' se ha establecido un slowmode de `' + args[1] + ' en ' + message.mentions.channels.first() + ' :clock1:');
                } else {
                    message.channel.setRateLimitPerUser(ratelimit, "Slowmode");
                    message.reply(' se ha establecido un slowmode de `' + args[1] + ' :clock1:');
                }*/
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}