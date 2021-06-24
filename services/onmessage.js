module.exports = function (client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment) {
    //Comprobamos que no hemos recibido mensaje a través de DM, que no es un bot, o que el propio autor del mensaje sea el bot
    if (message.channel.type === "dm" || message.author.bot || message.author === client.user) return;
    global = [];
    global.sql = [];
    global.data = [];
    global.sql.roles = [];
    global.id = message.guild.id;
    global.name = message.guild.name;
    var user = message.author;
    global.sql.config = "SELECT * FROM `servidores` WHERE guild = '" + global.id + "'";
    //Conectamos con Mariadb y obtenemos datos del servidor
    con.query(global.sql.config, function (err, result) {
        if (result) {
            if (typeof result[0] !== 'undefined') {
                global.prefix = result[0].prefix;
                var id = global.id;
                //Comprobamos si el mensaje ha comenzado con prefijo
                if (message.content.startsWith(global.prefix) && message.content != global.prefix) {

                    //Retirar el comandomsg.content.split(' ').splice(1).join(' ')
                    var cortar = message.content.trim().split(' ');

                    //Solo retira el prefijo del comando, por lo que cuenta también la acción deseada en el array
                    var mensajeprocesado = message.content.replace(global.prefix, '');
                    //Regex para los argumentos con ""

                    const regex = new RegExp('"[^"]+"|[\\S]+', 'g');
                    var args = [];
                    mensajeprocesado.match(regex).forEach(element => {
                        if (!element) return;
                        return args.push(element.replace(/"/g, ''));
                    });

                }
                var tolower = message.content;
                var contenido = tolower.toLowerCase();

                if (args) {
                    if (client.commands.has(args[0])) {
                        try {
                            client.commands.get(args[0]).execute(client, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global);
                        } catch (error) {
                            console.error(error);
                            message.reply(' se ha producido un error mientras se intentaba ejecutar ese comando...');
                        }
                    } else {
                        var consultacomandoscustom = "SELECT * FROM `comandos_custom` WHERE `guild` = " + global.id;
                        con.query(consultacomandoscustom, function (err, result) {
                            if (typeof result[0] !== 'undefined') {
                                var buscarcomando = "SELECT * FROM `comandos_custom` WHERE `guild` = '" + global.id + "' AND `cmd` = '" + args[0] + "'";
                                con.query(buscarcomando, function (err, result) {
                                    if (typeof result[0] !== 'undefined') {
                                        message.channel.send(":mega: " + result[0].returns);
                                    }
                                });
                            } else {
                                // Contestar a mensajes personalizdos
                            }
                        });
                    };
                }

                if (result[0].aspam_activado != 0) {
                    antispamworker(message);
                }
                //Leveling
                if (!contenido.startsWith(global.prefix)) {
                    if (result[0].niveles_activado != "0") {
                        levelworker(result, client, con, Jimp, downloader, webp, message, MessageAttachment, global);
                    }
                }
            }
        }
        else {
            var chx = message.guild.channels.cache.filter(chx => chx.type === "text").find(x => x.position === 0);
            var id = global.id;
            var sql = "INSERT INTO `servidores` (`guild`, `prefix`,`bienvenida_canal_id`,`bienvenida_mensaje`,`salida_canal`,`salida_mensaje`,`niveles_canal_id`,`niveles_canal_mensaje`) VALUES (" + id + ", '/','" + chx.id + "','Bienvenido {user} a {server}','" + chx.id + "','¡Adiós {user}!','" + chx.id + "','GG! {user} ha subido al nivel {nivel-nuevo}');";
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
    }
    )
}