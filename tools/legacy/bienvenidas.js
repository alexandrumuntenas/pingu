const { isInteger } = require("mathjs");
const emojiStrip = require('emoji-strip');

module.exports = {
    name: 'bienvenidas',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.config.bienvenidas;
        message.channel.send(':warning: El comando `bienvenidas` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            ftime = 0;
            function purga() {
                if (ftime == 0) {
                    ++ftime;
                } else {
                    message.channel.bulkDelete(2);
                }
            }

            var roles_user = new Set();
            var usersss = result[0].welcome_roles;
            var botssss = result[0].bienvenida_roles_bot;
            if (usersss) {
                var role_user = usersss.split(',');
                role_user.forEach(element => {
                    roles_user.add(element);
                });
            }

            function indice() {
                message.channel.send(`${lan.index.before} \n \n **${lan.index.avaliable}** \n **1.** ${lan.index.options.first}\n **2.** ${lan.index.options.second}\n **3.** ${lan.index.options.third} \n **4.** ${lan.index.options.fourth} \n **5.** ${lan.index.options.fifth} \n **6.** ${lan.index.options.sixth} \n **7.** ${lan.index.options.seventh}`);
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
                                purga()
                                t_cartel();
                                break;
                            case '5':
                                purga()
                                u_fondo();
                                break;
                            case '6':
                                purga()
                                user_give_role();
                                break;
                            case '7':
                                message.channel.send(`<:win_information:876119543968305233> ${lan.index.time_error}`);
                                break;
                            default:
                                purga();
                                indice();
                                break;
                        }
                    }).catch(collected => {
                        message.channel.send(`<:win_information:876119543968305233> ${lan.index.time_error}`);
                    });
            }

            function t_mensaje() {
                message.channel.send(`:arrow_right: ${lan.toggle_message.question} ${lan.toggle_message.avaliable_responses}: y(es) / n(o)`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().content === "y" || collected.first().content === "yes") {
                            var yes = "UPDATE `guild_data` SET `welcome_enabled` = '1' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(yes);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_message.response_b}`);
                            indice();
                        } else {
                            var no = "UPDATE `guild_data` SET `welcome_enabled` = '0' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(no);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_message.response_a}`);
                            indice();
                        }
                    });
            }

            function t_cartel() {
                message.channel.send(`:arrow_right: ${lan.toggle_cartel.question} ${lan.toggle_cartel.avaliable_responses}: y(es) / n(o)`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().content === "y" || collected.first().content === "yes") {
                            var yes = "UPDATE `guild_data` SET `welcome_image` = '1' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(yes);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_cartel.response_b}`);
                            indice();
                        } else {
                            var no = "UPDATE `guild_data` SET `welcome_image` = '0' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(no);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.toggle_cartel.response_a}`);
                            indice();
                        }
                    });
            }
            function add_rol_users() {
                message.channel.send(`:arrow_right: ${lan.dar_rol.add_rol.question}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().mentions.roles.first()) {
                            collected.first().mentions.roles.array().forEach(
                                element => {
                                    roles_user.add(element.id);
                                }
                            );
                            purga();
                            user_give_role();
                        } else {
                            message.channel.send(`<:win_information:876119543968305233> ${lan.dar_rol.add_rol.invalid_message}`);
                            add_rol_users();
                        }
                    })
            }
            function del_rol_users() {
                message.channel.send(`:arrow_right: ${lan.dar_rol.del_rol.question}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().mentions.roles.first()) {
                            collected.first().mentions.roles.array().forEach(
                                element => {
                                    roles_user.delete(element.id);
                                }
                            );
                            purga();
                            user_give_role();
                        } else {
                            message.channel.send(`<:win_information:876119543968305233> ${lan.dar_rol.del_rol.invalid_message}`);
                            del_rol_users();
                        }
                    });
            }
            function save_rol_users() {
                con.query("UPDATE `guild_data` SET `welcome_roles` = '" + Array.from(roles_user) + "' WHERE `guild_data`.`guild` = " + message.guild.id);
                dar_rol();
            }
            function user_give_role() {
                var rolset = "";
                roles_user.forEach(element => {
                    rolset = rolset + '<@&' + element + '> ';
                });
                message.channel.send(`${lan.dar_rol.give_role.showcase}\n${rolset}`);
                message.channel.send(`${lan.dar_rol.give_role.before} \n \n **${lan.dar_rol.give_role.avaliable}** \n **1.** ${lan.dar_rol.give_role.options.first}\n **2.** ${lan.dar_rol.give_role.options.second}\n **3.** ${lan.dar_rol.give_role.options.third} \n **4.** ${lan.dar_rol.give_role.options.fourth}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        switch (collected.first().content) {
                            case '1':
                                purga()
                                add_rol_users();
                                break;
                            case '2':
                                purga()
                                del_rol_users();
                                break;
                            case '3':
                                purga();
                                save_rol_users();
                                break;
                            default:
                                purga();
                                indice();
                                break;
                        }
                    });

            }

            function u_canal() {
                message.channel.send(`:arrow_right: ${lan.update_channel.question}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (collected.first().mentions.channels.first()) {
                            var channel = collected.first().mentions.channels.first();
                            var updatechannel = "UPDATE `guild_data` SET `welcome_channel` = '" + channel.id + "' WHERE `guild_data`.`guild` = " + message.guild.id;
                            con.query(updatechannel);
                            message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_channel.response}`);
                            indice();
                        } else {
                            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.update_channel.response}`)
                            u_canal();
                        }
                    });
            }

            function u_mensaje() {
                message.channel.send(`:arrow_right: ${lan.update_message.question} <:warn:858736919432527942> ${lan.update_message.emoji_remover}`)
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        var updatemsg = "UPDATE `guild_data` SET `welcome_message` = '" + emojiStrip(collected.first().content) + "' WHERE `guild_data`.`guild` = " + message.guild.id;
                        con.query(updatemsg);
                        message.channel.send(`<:pingu_check:876104161794596964> ${lan.update_message.response}`);
                        indice();
                    });
            }

            function u_fondo() {
                message.channel.send(':arrow_right: https://pingu.duoestudios.es/personalizacion/fondos. <:warn:858736919432527942> No debe incluír el `#`')
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (isInteger(collected.first().content)) {
                            if (parseInt(collected.first().content) <= 20 || parseInt(collected.first().content) >= 1) {
                                var updatemsg = "UPDATE `guild_data` SET `bienvenida_fondo` = '" + collected.first().content + "' WHERE `guild_data`.`guild` = " + message.guild.id;
                                con.query(updatemsg);
                                message.channel.send('<:pingu_check:876104161794596964> Se ha actualizado el fondo de los carteles de bienvenida');
                                indice();
                            } else {
                                message.channel.send('<:pingu_cross:876104109256769546> Ese fondo no existe, por favor, introduzca un ID válido.')
                                u_fondo();
                            }
                        } else {
                            message.channel.send('<:pingu_cross:876104109256769546> El valor introducido debe ser alfanumérico.')
                            u_fondo();
                        }
                    });
            }

            message.channel.send(`<:win_information:876119543968305233> ${lan.startup}`);
            indice();
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`);
        }
    }
}