module.exports = {
    name: 'ca',
    execute(libraries) {
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            var valor = result[0].ccaa_activado;
            if (valor == 1) {
                var fin = 0;
                var response = 'desactivado';
            } else {
                var fin = 1;
                var response = 'activado';
            }
            var sql = "UPDATE `servidores` SET `ccaa_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + data.server.id;
            message.channel.send(':white_check_mark: He ' + response + ' correctamente el módulo de comunidad activa');
            con.query(sql);
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}