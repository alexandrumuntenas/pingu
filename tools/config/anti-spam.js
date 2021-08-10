
module.exports = {
    name: 'anti-spam',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.antispam;
        message.channel.send(':warning: El comando `prefix` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            var valor = result[0].aspam_activado;
            if (valor == 1) {
                var fin = 0;
                var response = lan.response_a;
            } else {
                var fin = 1;
                var response = lan.response_b;
            }
            var sql = "UPDATE `guild_data` SET `aspam_activado` = '" + fin + "' WHERE `guild_data`.`guild` = " + message.guild.id;
            message.channel.send(`:white_check_mark: ${response}`);
            con.query(sql);
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}