const emojiStrip = require('emoji-strip');
const { isInteger } = require('mathjs');

module.exports = {
    name: 'niveles',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.niveles;
        message.channel.send(':warning: El comando `niveles` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
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
                message.channel.send(`${lan.index.before} \n \n **${lan.index.avaliable}** \n **1.** ${lan.index.options.first} \n **2.** ${lan.index.options.second} \n **3.** ${lan.index.options.third} \n **4.** ${lan.index.options.fourth} \n **5.** ${lan.index.options.fifth} \n **6.** ${lan.index.options.sixth} \n **7.** ${lan.index.options.seventh}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        switch (collected.first().content) {
                            case '1':
                                purga();
                                t_niveles();
                                break;
                            case '2':
                                purga();
                                u_mensaje();
                                break;
                            case '3':
                                purga();
                                u_canal();
                                break;
                            case '4':
                                purga();
                                u_fondo();
                                break;
                            case '5':
                                purga();
                                u_dificultad();
                                break;
                            case '6':
                                purga();
                                message.channel.send('Configuración en desarrollo...');
                                indice();
                                break;
                            case '7':
                                message.channel.send(`<:win_information:876119543968305233> ${lan.time_error}`);
                                break;
                            default:
                                purga();
                                indice();
                                break;
                        }
                    }).catch(error => {
                        message.channel.send(`<:win_information:876119543968305233> ${lan.time_error}`);
                    });
            }

            function t_niveles() {
                message.channel.send(`:arrow_right: ${lan.toggle_niveles.question} ${lan.toggle_niveles.avaliable_responses}: y(es) / n(o)`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().content === "y" || collected.first().content === "yes") {
                            var yes = "UPDATE `guild_data` SET `niveles_activado` = '1' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(yes);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_niveles.response_a}`);
                            indice();
                        } else {
                            var no = "UPDATE `guild_data` SET `niveles_activado` = '0' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(no);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_niveles.response_b}`);
                            indice();
                        }
                    });
            }

            function u_mensaje() {
                message.channel.send(`:arrow_right: ${lan.update_message.question} <:warn:858736919432527942> ${lan.update_message.success}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        var updatemsg = "UPDATE `guild_data` SET `niveles_canal_mensaje` = '" + emojiStrip(collected.first().content) + "' WHERE `guild_data`.`guild` = " + message.guild.id;
                        con.query(updatemsg);
                        message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_message.success}`);
                        indice();
                    });
            }

            function u_canal() {
                message.channel.send(`:arrow_right: ${lan.update_channel}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().mentions.channels.first()) {
                            var channel = collected.first().mentions.channels.first();
                            var updatechannel = "UPDATE `guild_data` SET `niveles_canal_id` = '" + channel.id + "' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(updatechannel);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_channel.success}`);
                            indice();
                        } else {
                            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.update_channel.invalid}`)
                            u_canal();
                        }
                    });
            }

            function u_fondo() {
                message.channel.send(`:arrow_right: ${lan.update_fondo.question}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (isInteger(collected.first().content)) {
                            if (parseInt(collected.first().content) <= 20 && parseInt(collected.first().content) >= 1) {
                                var updatemsg = "UPDATE `guild_data` SET `niveles_fondo` = '" + collected.first().content + "' WHERE `guild_data`.`guild` = " + message.guild.id;
                                con.query(updatemsg);
                                message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_fondo.success}`);
                                indice();
                            } else {
                                message.channel.send(`<:pingu_cross:876104109256769546> ´${lan.update_fondo.invalid}`);
                                u_fondo();
                            }
                        } else {
                            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.update_fondo.notinteger}`)
                            u_fondo();
                        }
                    });
            }

            function u_dificultad() {
                message.channel.send(`:arrow_right: ${lan.update_dificultad.question}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (isInteger(collected.first().content)) {
                            if (parseInt(collected.first().content) < 5 && parseInt(collected.first().content) > 0) {
                                var updatemsg = "UPDATE `guild_data` SET `niveles_dificultad` = '" + collected.first().content + "' WHERE `guild_data`.`guild` = " + message.guild.id;
                                con.query(updatemsg);
                                message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_dificultad.success}`);
                                indice();
                            } else {
                                message.channel.send(`<:win_information:876119543968305233> ${lan.update_dificultad.invalid}`);
                                u_dificultad();
                            }
                        } else {
                            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.update_dificultad.notinteger}`);
                            u_fondo();
                        }
                    });
            }

            message.channel.send(`<:info:858737080950718484> ${lan.startup}`);
            indice();
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`);
        }
    }
}