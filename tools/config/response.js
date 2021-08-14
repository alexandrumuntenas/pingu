module.exports = {
    name: 'response',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.response;
        message.channel.send(':warning: El comando `response` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
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
                        message.channel.send(`:arrow_right: ${lan.create.question_a}`)
                        message.channel.awaitMessages(m => m.author.id == message.author.id,
                            { max: 1 }).then(collected => {
                                var accionante = collected.first().content;
                                accionante = accionante.toLowerCase();
                                message.channel.send(`:arrow_right: ${lan.create.question_b}`);
                                message.channel.awaitMessages(m => m.author.id == message.author.id,
                                    { max: 1 }).then(collected => {
                                        var respuesta = collected.first().content;
                                        var crearcres = "INSERT INTO `guild_responses` (`identificador`,`guild`, `action`, `returns`) VALUES ('" + identificador + "','" + message.guild.id + "', '" + accionante + "', '" + respuesta + "')";
                                        con.query(crearcres, function (err) {
                                            console.log(err)
                                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.create.success}: \`${identificador}\``);
                                        })
                                    })
                            });
                        break;
                    case 'remove':
                        var delcmd = "DELETE FROM `guild_responses` WHERE `identificador` = '" + args[2] + "' AND `guild` = " + message.guild.id;
                        con.query(delcmd, function (err) {
                            console.log(err)
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.remove.success}: \`${args[2]}\``);
                        })
                        break;
                    default:
                        message.channel.send(`<:win_information:876119543968305233> ${lan.invalid} :arrow_right: https://pingu.duoestudios.es/gestion-del-servidor/respuestas-personalizadas`)
                        break;
                }
            } else {
                message.channel.send(`<:win_information:876119543968305233> ${lan.missing_args}: \`create\` \`remove\``);
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`);
        }
    }
}