module.exports = {
    name: ['help', 'h'],
    execute(args, client, con, contenido, message, result) {
        console.log(args);
        if (args[1]) {
            switch (args[1]) {
                case 'bienvenidas':
                    break;
            }
        } else {
        }
    }
}