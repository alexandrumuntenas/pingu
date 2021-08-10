module.exports = {
    name: 'prefix',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.prefix;
        message.channel.send(':warning: El comando `prefix` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                var sql = "UPDATE `guild_data` SET `prefix` = '" + args[1] + "' WHERE `guild_data`.`guild` = '" + message.guild.id + "'";
                con.query(sql, function (err) {
                });
                message.channel.send(`:white_check_mark: ${lan.response}: \`${args[1]}\``);
            } else {
                message.channel.send(`:information_source: ${lan.missing_arg}: \`${result[0].prefix}prefix <new prefix>\``);
            }
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}