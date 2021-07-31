module.exports = {
    name: 'prefix',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.prefix;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                var sql = "UPDATE `servidores` SET `prefix` = '" + args[1] + "' WHERE `servidores`.`guild` = '" + message.guild.id + "'";
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