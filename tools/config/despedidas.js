const emojiStrip = require('emoji-strip');

module.exports = {
    name: 'despedidas',
    execute(args, client, con, contenido, global, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.despedidas;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            ftime = 0;
            function purga() {
                if (ftime == 0) {
                    ++ftime;
                } else {
                    message.channel.bulkDelete(2);
                }
            }

            function indice() {
                message.channel.send(` ${lan.index.before} \n \n **${lan.index.avaliable}** \n **1.** ${lan.index.options.first} \n **2.** ${lan.index.options.second}  \n **3.** ${lan.index.options.third} \n **4.** ${lan.index.options.fourth}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        switch (collected.first().content) {
                            case '1':
                                purga()
                                t_mensaje();
                                break;
                            case '2':
                                purga()
                                u_mensaje();
                                break;
                            case '3':
                                purga()
                                u_canal();
                                break;
                            case '4':
                                message.channel.send(`:information_source: ${lan.time_error}`)
                                break;
                            default:
                                purga();
                                indice();
                                break;
                        }
                    }).catch(collected => {
                        message.channel.send(`:information_source: ${lan.time_error}`)
                    });
            }

            function t_mensaje() {
                message.channel.send(`:arrow_right: ${lan.toggle_message.question} ${lan.toggle_message.avaliable_responses}: y(es) / n(o)`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().content === "y" || collected.first().content === "yes") {
                            var yes = "UPDATE `servidores` SET `salida_mensaje_activado` = '1' WHERE `servidores`.`guild` = " + global.id;
                            con.query(yes);
                            message.channel.send(`:white_check_mark: ${lan.toggle_message.response_b}`);
                            indice();
                        } else {
                            var no = "UPDATE `servidores` SET `salida_mensaje_activado` = '0' WHERE `servidores`.`guild` = " + global.id;
                            con.query(no);
                            message.channel.send(`:white_check_mark: ${lan.toggle_message.response_a}`);
                            indice();
                        }
                    });
            }

            function u_canal() {
                message.channel.send(`:arrow_right: ${lan.update_channel.question}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().mentions.channels.first()) {
                            var channel = collected.first().mentions.channels.first();
                            var updatechannel = "UPDATE `servidores` SET `salida_canal` = '" + channel.id + "' WHERE `servidores`.`guild` = " + global.id;
                            con.query(updatechannel);
                            message.channel.send(`:white_check_mark: ${lan.update_channel.success}`);
                            indice();
                        } else {
                            message.channel.send(`:x: ${lan.update_channel.invalid}`)
                            u_canal();
                        }
                    });
            }

            function u_mensaje() {
                message.channel.send(`:arrow_right: ${lan.update_message.question} <:warn:858736919432527942> ${lan.update_message.emoji_remover}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        var updatemsg = "UPDATE `servidores` SET `bienvenida_mensaje` = '" + emojiStrip(collected.first().content) + "' WHERE `servidores`.`guild` = " + global.id;
                        con.query(updatemsg);
                        message.channel.send(`:white_check_mark: ${lan.update_message.success}`);
                        indice();
                    });
            }

            message.channel.send(`<:info: 858737080950718484 > ${lan.startup}`);
            indice();
        } else {
            message.channel.send(`:x: ${lan.permerror}`);
        }
    }
}