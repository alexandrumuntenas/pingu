module.exports = {
    name: 'unbanall',
    execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, data) {
        if (result[0].moderador_activado != 0) {
            if (message.member.hasPermission("ADMINISTRATOR")) {
                message.guild.fetchBans().then(bans => {
                    if (bans.size == 0) { message.channel.send(":neutral_face: No hay usuarios baneados."); };
                    bans.forEach(ban => {
                        message.guild.members.unban(ban.user.id);
                    })
                }).then(() => message.channel.send(":white_check_mark: Se han desbaneado a todos los usuarios de este servidor.")).catch(e => console.log(e))
            } else { message.channel.send(":x: No tienes suficientes permisos para ejecutar este comando.") }
        } else { message.channel.send(":x: El módulo de moderación no está activado") }
    }
}