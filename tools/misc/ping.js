const Math = require('mathjs');

module.exports = {
    name: 'ping',
    execute(args, client, con, contenido, global, message, result) {
        message.channel.send(`🏓 Pong! \n🕑 Comando: **${Date.now() - message.createdTimestamp}ms** \n📨 API: **${Math.round(client.ws.ping)}ms**`);
    }
}