module.exports = {
    name: 'ping',
    execute(args, canvacord, client, con, Sentry, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        message.channel.send(`🏓 Pong! \n🕑 Comando: **${Date.now() - message.createdTimestamp}ms** \n📨 API: **${Math.round(client.ws.ping)}ms**`);
    }
}