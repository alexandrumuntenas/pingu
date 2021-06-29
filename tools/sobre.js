module.exports = {
    name: 'sobre',
    execute(args, canvacord, client, con, Sentry, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        const embed = new MessageEmbed()
            .setAuthor(
                `Información sobre ${client.user.username}`,
                client.user.displayAvatarURL())
            .addFields(
                {
                    name: '¿Quiere añadirme a su servidor?',
                    value: 'https://discord.com/oauth2/authorize?client_id=827199539185975417&permissions=1933044831&scope=bot%20applications.commands',
                },
                {
                    name: 'Documentación',
                    value: `https://pingu.duoestudios.es`,
                },
                {
                    name: 'Desarrollado por',
                    value: '<@722810818823192629>'
                },
                {
                    name: 'Ayudando a más de',
                    value: client.guilds.cache.size + ' servidores'
                },
                {
                    name: 'Tiempo conectado...',
                    value: `${process.uptime().toFixed(2)}s`,
                },
            )
        message.channel.send(embed)
    }
}