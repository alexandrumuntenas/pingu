module.exports = {
    name: 'ayuda',
    execute(args, client, con, contenido, global, message, result) {
        message.channel.send(':information_source: Puede consultar la documentación en https://pingu.duoestudios.es/')
    }
}