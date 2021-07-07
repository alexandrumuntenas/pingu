const { exec } = require('child_process');

module.exports = {
    name: 'admin',
    execute(args, client, con, contenido, global, message, result) {
        if (message.author.id === '722810818823192629') {
            if (args[1]) {
                switch (args[1]) {
                    case 'addmodule':
                        exec(`npm i ${args[1]}`, (err, stdout, stderr) => {
                            if (err) {
                                message.channel.send(':x:' + err);
                            } else {
                                message.channel.send(stdout);
                            }
                        });
                        break;
                    case 'rcmd':
                        console.log('[LO] Intentado recargar el comando ' + args[3]);
                        var commandName = args[0].toLowerCase();
                        var command = message.client.commands.get(commandName)
                            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                        if (!command) {
                            console.log('[ERR] Intentado recargar el módulo ' + args[2]);
                            return message.channel.send(`No existe ningún comando con ese nombre o alias \`${commandName}\`, ${message.author}!`);
                        }

                        var commandFolders = fs.readdirSync('./tools');
                        var folderName = commandFolders.find(folder => fs.readdirSync(`./tools/`).includes(`${args[2]}.js`));

                        delete require.cache[require.resolve(`../tools/${args[2]}.js`)];

                        try {
                            var newCommand = require(`../tools/${args[2]}.js`);
                            message.client.commands.set(newCommand.name, newCommand);
                            message.channel.send(`El comando \`${args[2]}\` ha sido recargado!`);
                            console.log('[OK] Recargar el comando ' + args[2]);
                        } catch (error) {
                            console.log('[ERR] Intentado recargar el módulo ' + args[2]);
                            message.channel.send(`se ha producido un error recargando el comando \`${args[2]}\`:\n\`${error.message}\``);
                        }
                        break;
                    case 'rser':
                        console.log('[LO] Intentado recargar el servicio ' + args[2]);
                        var commandName = args[0].toLowerCase();
                        var command = message.client.commands.get(commandName)
                            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                        if (!command) {
                            console.log('[ERR] Intentado recargar el servicio ' + args[2]);
                            return message.channel.send(`No existe ningún servicio con ese nombre o alias \`${commandName}\`, ${message.author}!`);
                        }

                        var commandFolders = fs.readdirSync('./services/');
                        var folderName = commandFolders.find(folder => fs.readdirSync(`./services/`).includes(`${args[1]}.js`));

                        delete require.cache[require.resolve(`../services/${args[2]}.js`)];

                        try {
                            var newCommand = require(`../services/${args[2]}.js`);
                            message.client.commands.set(newCommand.name, newCommand);
                            message.channel.send(`El servicio \`${args[2]}\` ha sido recargado!`);
                            console.log('[OK] Recargar el servicio ' + args[2]);
                        } catch (error) {
                            console.log('[ERR] Intentado recargar el servicio ' + args[2]);
                            if (error.code === "MODULE_NOT_FOUND") {
                                message.channel.send(`:x: El servicio especificado no existe.`);
                            }
                        }
                        break;
                }
            } else {
                message.channel.send(':x: Debes especificar una acción: `addmodule`, `rcmd`, `rser`')
            }
        } else {
            message.channel.send(':face_with_raised_eyebrow:')
        }
    }
}