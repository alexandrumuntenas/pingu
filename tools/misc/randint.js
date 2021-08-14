const Math = require('mathjs');

module.exports = {
    name: 'randint',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.misc.randint;
        if (args[1]) {
            var aleatorio = Math.round(Math.random(1, parseInt(args[1])));
            message.channel.send(`:teacher: ${lan} **${aleatorio}**`);
        } else {
            var aleatorio = Math.round(Math.random(1, 100));
            message.channel.send(`:teacher: ${lan} **${aleatorio}**`);
        }
    }
}