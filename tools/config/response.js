module.exports = {
    name: 'response',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.response;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            function makeId(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() *
                        charactersLength));
                }
                return result;
            }
            if (args[1]) {
                switch (args[1]) {
                    case 'create':
                        var identificador = makeId(7);
                        message.reply(`:arrow_right: ${lan.create.question_a}`)
                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                            { max: 1 }).then(collected => {
                                var accionante = collected.first().content;
                                accionante = accionante.toLowerCase();
                                message.channel.send(`:arrow_right: ${lan.create.question_b}`);
                                message.channel.awaitMessages(m => m.author.id == message.author.id,
                                    { max: 1 }).then(collected => {
                                        var respuesta = collected.first().content;
                                        var crearcres = "INSERT INTO `respuestas_custom` (`identificador`,`guild`, `action`, `returns`) VALUES ('" + identificador + "','" + message.guild.id + "', '" + accionante + "', '" + respuesta + "')";
                                        con.query(crearcres, function (err) {
                                            console.log(err)
                                            message.channel.send(`:white_check_mark: ${lan.create.success}: \`${identificador}\``);
                                        })
                                    })
                            });
                        break;
                    case 'remove':
                        var delcmd = "DELETE FROM `respuestas_custom` WHERE `identificador` = '" + args[2] + "' AND `guild` = " + message.guild.id;
                        con.query(delcmd, function (err) {
                            console.log(err)
                            message.channel.send(`:white_check_mark: ${lan.remove.success}: \`${args[2]}\``);
                        })
                        break;
                    default:
                        message.channel.send(`:information_source: ${lan.invalid} :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/respuestas-personalizadas`)
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