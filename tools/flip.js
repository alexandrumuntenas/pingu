var flip = require('flipacoin')

module.exports = {
    name: 'flip',
    execute(args, client, con, contenido, global, message, result) {
        var flipdata = flip();
        if (flipdata == "head") {
            message.channel.send(':coin: Ha salido cara')
        } else {
            message.channel.send(':coin: Ha salido cruz')
        }
    }
}