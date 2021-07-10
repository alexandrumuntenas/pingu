const { isInteger } = require("mathjs");

module.exports = {
    name: 'moderador',
    execute(args, client, con, contenido, global, message, result) {
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
                message.channel.send('Para ejecutar una opción, indique el número de la opción. \n \n ****Opciones Disponibles** \n **1.** ¿Activar comandos de moderación?  (Alterna entre sí y no) \n **2.** Expulsar/banear usuario al alcanzar cierta cantidad de infracciones \n **3.** Salir');
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
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
                                message.channel.send(':information_source: Se ha cerrado la configuración del módulo de **MODERACIÓN**')
                                break;
                            default:
                                purga()
                                indice();
                                break;
                        }
                    });
            }

            function t_mod() {
                var valor = result[0].moderador_activado;
                if (valor == 1) {
                    var fin = 0;
                } else {
                    var fin = 1;
                }
                var sql = "UPDATE `servidores` SET `moderador_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                if (fin == 0) {
                    var response = 'desactivado';
                } else {
                    var response = 'activado';
                }
                con.query(sql);
                message.channel.send(':white_check_mark: Se ha ' + response + ' correctamente los comandos de moderación.');
                indice();
            }

            function t_modwarn() {
                var valor = result[0].moderador_warn_expulsion_activado;
                if (valor == 1) {
                    var fin = 0;
                    var response = 'desactivado';
                    result[0].moderador_warn_expulsion_activado = 0;
                } else {
                    var fin = 1;
                    var response = 'activado';
                    result[0].moderador_warn_expulsion_activado = 1;
                }
                var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_activado` = '" + fin + "' WHERE `servidores`.`guild` = " + message.guild.id;
                message.channel.send(':white_check_mark: He ' + response + ' correctamente el `auto-ban` y el `auto-kick` del comando `warn`.');
                con.query(sql, function () {
                    e_modwarn();

                });
            }

            function e_limite() {
                message.channel.send(':arrow_right: ¿Cuántos warns debe tener un usuario para tomar medidas de forma automática?');
                message.channel.awaitMessages(m => m.author.id == message.author.id,
                    { max: 1 }).then(collected => {
                        if (isInteger(parseInt(collected.first().content))) {
                            var cantidad = parseInt(collected.first().content);
                            var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_cantidad` = '" + cantidad + "' WHERE `servidores`.`guild` = " + global.id;
                            con.query(sql);
                            message.channel.send(':white_check_mark: Se ha actualizado la cantidad correctamente.');
                            e_modwarn();
                        } else {
                            message.channel.send(':information_source: Se debe introducir un valor alfanumérico');
                            e_limite();
                        }
                    })


            }

            function t_medida() {
                var valor = result[0].moderador_warn_expulsion_accion;
                if (valor == 1) {
                    var fin = 0;
                    var response = 'expulsar';
                    result[0].moderador_warn_expulsion_accion = 0;
                } else {
                    var fin = 1;
                    var response = 'banear';
                    result[0].moderador_warn_expulsion_accion = 1;
                }
                var sql = "UPDATE `servidores` SET `moderador_warn_expulsion_accion` = '" + fin + "' WHERE `servidores`.`guild` = " + global.id;
                message.channel.send(':information_source: Se ha cambiado correctamente la acción a tomar a `' + response + '`');
                con.query(sql);
                e_modwarn();
            }
            function e_modwarn() {
                message.channel.send('Para ejecutar una opción, indique el número de la opción. \n \n ****Opciones Disponibles** \n **1.** ¿Activar función?  \n **2.** Configurar medida que se tomará si un usuario alcanza el límite de warns.  \n **3.** Modificar límite de warns (predeterminado => 5) \n **4.** Volver');
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
            message.channel.send('<:info:858737080950718484> Configuración del módulo de **MODERACIÓN**');
            indice();


        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}