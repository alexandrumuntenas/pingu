var flip = require('flipacoin')

module.exports = {
    name: 'flip',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.misc.flip;
        var flipdata = flip();
        if (flipdata == "head") {
            message.channel.send(`:coin: ${lan.cara}`)
        } else {
            message.channel.send(`:coin: ${lan.cruz}`)
        }
    }
}