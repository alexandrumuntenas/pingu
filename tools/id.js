module.exports = {
    name: 'id',
    execute(args, client, con, contenido, global, message, result) {
        let server = message.guild.id;
        message.channel.send(":information_source: El `ID` del servidor es `" + server + "`");
    }
}