module.exports = {
    name: 'ccmd',
    execute(args, client, con, contenido, global, message, result) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'crear':
                        var motivo = message.content.replace(global.prefix + 'ccmd crear ' + args[2] + '', '');
                        var crearccmd = "INSERT INTO `comandos_custom` (`guild`, `cmd`, `returns`) VALUES ('" + global.id + "', '" + args[2] + "', '" + motivo + "')";
                        con.query(crearccmd, function (err) {
                            console.log(err)
                            message.channel.send(':white_check_mark: Se ha creado correctamente el comando personalizado `' + args[2] + '`. Este devolverá el valor especificado `' + motivo + '`');
                        })
                        break;
                    case 'eliminar':
                        var delcmd = "DELETE FROM `comandos_custom` WHERE `cmd` = '" + args[2] + "' AND `guild` = " + global.id;
                        con.query(delcmd, function (err) {
                            console.log(err)
                            message.channel.send(':white_check_mark: Se ha eliminado correctamente el comando personalizado `' + args[2] + '`');
                        })
                        break;
                    default:
                        message.channel.send(':information_source: No ha indicado una opción correcta :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/comandos-personalizados')
                        break;
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando');
        }
    }
}