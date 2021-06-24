module.exports = {
    name: 'id',
    execute(libraries) {
        let server = message.guild.id;
        message.channel.send(":information_source: El `ID` es `" + server + "`");
    }
}