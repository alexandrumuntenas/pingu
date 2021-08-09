module.exports = {
    name: 'command',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.command;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                switch (args[1]) {
                    case 'create':
                        var motivo = message.content.replace(`${result[0].prefix}command create ${args[2]}`, '');
                        var crearccmd = "INSERT INTO `guild_commands` (`guild`, `cmd`, `returns`) VALUES ('" + message.guild.id + "', '" + args[2] + "', '" + motivo + "')";
                        con.query(crearccmd, function (err) {
                            console.log(err)
                            message.channel.send(`:white_check_mark: ${lan.create.before}\`${args[2]}\`. ${lan.create.after} \`${motivo}\``);
                        })
                        break;
                    case 'remove':
                        var delcmd = "DELETE FROM `guild_commands` WHERE `cmd` = '" + args[2] + "' AND `guild` = " + message.guild.id;
                        con.query(delcmd, function (err) {
                            console.log(err)
                            message.channel.send(`:white_check_mark: ${lan.remove}: \`${args[2]}\``);
                        })
                        break;
                    default:
                        message.channel.send(`:information_source: ${lan.invalid} :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/comandos-personalizados`)
                        break;
                }
            } else {
                message.channel.send(`:information_source: ${lan.missing_args}: \`create\` \`remove\``);
            }
        } else {
            message.channel.send(`:x: ${lan.permerror}`);
        }
    }
}