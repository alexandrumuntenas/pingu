module.exports = {
    name: 'sobre',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
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