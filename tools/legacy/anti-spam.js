
module.exports = {
    name: 'anti-spam',
    execute (args, client, con, contenido, message, result) {
        let lan = require(`../../languages/${result[0].guild_language}.json`)
        lan = lan.tools.config.antispam
        message.channel.send(':warning: El comando `prefix` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            const valor = result[0].aspam_activado
            if (valor == 1) {
                var fin = 0
                var response = lan.response_a
            } else {
                var fin = 1
                var response = lan.response_b
            }
            const sql = "UPDATE `guild_data` SET `aspam_activado` = '" + fin + "' WHERE `guild_data`.`guild` = " + message.guild.id
            message.channel.send(`<:pingu_check:876104161794596964> ${response}`)
            con.query(sql)
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`)
        }
    }
}
