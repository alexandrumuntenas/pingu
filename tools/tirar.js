module.exports = {
    name: 'tirar',
    execute(libraries) {
        if (args[1]) {
            var aleatorio = Math.round(Math.random(1, parseInt(args[1])));
            message.channel.send(':teacher: Tras varias cuentas supercomplicadas, el número generado es `' + aleatorio + '`');
        } else {
            var aleatorio = Math.round(Math.random(1, 100));
            message.channel.send(':teacher: Tras varias cuentas supercomplicadas, el número generado es `' + aleatorio + '`');
        }
    }
}