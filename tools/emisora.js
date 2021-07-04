module.exports = {
    name: 'emisora',
    execute(args, client, con, contenido, global, message, result) {
        async function play(url) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(url);
            dispatcher.on('end', () => {
                play();
            });
        }
        if (args[1]) {
            var emisora = args[1];
            con.query('SELECT * FROM `emisoras` WHERE `emisora` LIKE \'' + emisora + '\'', function (err, result) {
                if (result[0]) {
                    play(result[0].url);
                    message.channel.send(':radio: Reproduciendo ' + emisora);
                } else {
                    message.channel.send(':x: No se ha encontrado la emisora solicitada en nuestra base de datos. Conoce las emisoras disponibles en https://pingu.duoestudios.es/+-informacion/emisoras-disponibles');
                }
            });
        } else {
            con.query('SELECT * FROM `emisoras`', function (err, result) {
                if (err) {
                    message.channel.send(':x: Se ha producido el siguiente error: `' + err + '`');
                }
                message.channel.send(':information_source: Puede consultar las emisoras disponibles en https://pingu.duoestudios.es/+-informacion/emisoras-disponibles');
                result.forEach(element => message.channel.send(':radio: ' + element.emisora));
            });
        }
    }
}