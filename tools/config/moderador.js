const { isInteger } = require("mathjs");

module.exports = {
    name: 'moderador',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config.moderador;
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
                message.channel.send(`${lan.index.before} \n \n **${lan.index.avaliable}** \n **1.** ${lan.index.options.first} \n **2.** ${lan.index.options.second} \n **3.** ${lan.index.options.third}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1, time: 30000, errors: ['time'] }).then(collected => {
                        switch (collected.first().content) {
                            case '1':
                                purga()
                                t_mod();
                                break;
                            case '2':
                                purga()
                                e_modwarn();
                                break;
                            case '3':
                                message.channel.send(`:information_source: ${lan.index.time_error}`);
                                break;
                            default:
                                purga()
                                indice();
                                break;
                        }
                    }).catch(collected => {
                        message.channel.send(`:information_source: ${lan.index.time_error}`);
                    });;
            }

            function t_mod() {
                var valor = result[0].moderador_activado;
                if (valor == 1) {
                    var fin = 0;
                    var response = lan.toggle_moderator.response_a;
                    result[0].moderador_activado = 0;
                } else {
                    var fin = 1;
                    var response = lan.toggle_moderator.response_b;
                    result[0].moderador_activado = 1;
                }
                var sql = "UPDATE `servidores` SET `moderador_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + message.guild.id;
                con.query(sql);
                message.channel.send(`:white_check_mark: ${response}`);
                indice();
            }

            function t_modwarn() {
                var valor = result[0].moderador_warn_expulsion_activado;
                if (valor == 1) {
                    var fin = 0;
                    var response = lan.toggle_modwarn.response_a;
                    result[0].moderador_warn_expulsion_activado = 0;
                } else {
                    var fin = 1;
                    var response = lan.toggle_moderator.response_b;
                    result[0].moderador_warn_expulsion_activado = 1;
                }
                var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + message.guild.id;
                message.channel.send(`:white_check_mark: ${response}`);
                con.query(sql, function () {
                    e_modwarn();

                });
            }

            function e_limite() {
                message.channel.send(`:arrow_right: ${lan.e_limite.question}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (isInteger(parseInt(collected.first().content))) {
                            var cantidad = parseInt(collected.first().content);
                            var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_cantidad` = '" + cantidad + "' WHERE `servidores`.`guild` = " + message.guild.id;
                            con.query(sql);
                            message.channel.send(`:white_check_mark: ${lan.e_limite.success}`);
                            e_modwarn();
                        } else {
                            message.channel.send(`:information_source:  ${lan.e_limite.notinteger}`);
                            e_limite();
                        }
                    })
            }

            function t_medida() {
                var valor = result[0].moderador_warn_expulsion_accion;
                if (valor == 1) {
                    var fin = 0;
                    var response = lan.toggle_medida.response_a;
                    result[0].moderador_warn_expulsion_accion = 0;
                } else {
                    var fin = 1;
                    var response = lan.toggle_medida.response_b;
                    result[0].moderador_warn_expulsion_accion = 1;
                }
                var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_accion` = '" + fin + "' WHERE `servidores`.`guild` = " + message.guild.id;
                message.channel.send(`:white_check_mark: ${response}`);
                con.query(sql);
                e_modwarn();
            }
            function e_modwarn() {
                message.channel.send(`${lan.e_modwarn.before} \n \n **${lan.e_modwarn.avaliable}** \n **1.** ${lan.e_modwarn.options.first} \n **2.** ${lan.e_modwarn.options.second} \n **3.** ${lan.e_modwarn.options.third} \n **4.** ${lan.e_modwarn.options.fourth}`);
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        switch (collected.first().content) {
                            case '1':
                                purga()
                                t_modwarn();
                                break;
                            case '2':
                                purga()
                                t_medida();
                                break;
                            case '3':
                                purga();
                                e_limite();
                                break;
                            case '4':
                                indice();
                                break;
                            default:
                                purga()
                                e_modwarn();
                                break;
                        }
                    });
            }
            message.channel.send(`<:info:858737080950718484> ${lan.startup}`);
            indice();


        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}