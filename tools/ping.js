module.exports = {
    name: 'ping',
    execute(libraries) {
        message.channel.send(`🏓 Pong! \n🕑 Comando: **${Date.now() - message.createdTimestamp}ms** \n📨 API: **${Math.round(client.ws.ping)}ms**`);
    }
}