module.exports = {
    name: 'ccmd',
    execute(libraries) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'crear':
                        var motivo = message.content.replace(data.server.prefix + 'ccmd crear ' + args[2] + '', '');
                        var crearccmd = "INSERT INTO `comandos_custom` (`guild`, `cmd`, `returns`) VALUES ('" + data.server.id + "', '" + args[2] + "', '" + motivo + "')";
                        con.query(crearccmd, function (err) {
                            if (err) throw err;
                            message.channel.send(':white_check_mark: Se ha creado correctamente el comando personalizado `' + args[2] + '`. Este devolverá el valor especificado `' + motivo + '`');
                        })
                        break;
                    case 'eliminar':
                        var delcmd = "DELETE FROM `comandos_custom` WHERE `cmd` = '" + args[2] + "' AND `guild` = " + data.server.id;
                        con.query(delcmd, function (err) {
                            if (err) throw err;
                            message.channel.send(':white_check_mark: Se ha eliminado correctamente el comando personalizado `' + args[2] + '`');
                        })
                        break;
                    default:
                        message.channel.send(':information_source: No has indicado una opción correcta :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/comandos-personalizados')
                        break;
                }
            }
        } else {
            message.channel.send(':x: No tienes permisos suficientes para ejecutar este comando');
        }
    }
}