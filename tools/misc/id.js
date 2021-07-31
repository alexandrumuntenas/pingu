module.exports = {
    name: 'id',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.misc.id;
        let server = message.guild.id;
        message.channel.send(`:information_source: ${lan} \`${server}\``);
    }
}