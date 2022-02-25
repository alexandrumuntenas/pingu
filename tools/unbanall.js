module.exports = {
    name: 'unbanall',
    execute(args, client, con, contenido, global, message, result) {
        if (result[0].moderador_activado != 0) {
            if (message.member.hasPermission("ADMINISTRATOR")) {
                message.guild.fetchBans().then(bans => {
                    if (bans.size == 0) { message.channel.send(":neutral_face: No hay usuarios baneados."); };
                    bans.forEach(ban => {
                        message.guild.members.unban(ban.user.id);
                    })
                }).then(() => message.channel.send(":white_check_mark: Se han desbaneado a todos los usuarios de este servidor.")).catch(e => console.log(e))
            } else { message.channel.send(":x: No dispone de permisos suficientes para ejecutar este comando") }
        } else { message.channel.send(":x: El módulo de moderación no está activado") }
    }
}