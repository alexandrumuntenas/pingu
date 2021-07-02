module.exports = {
    name: 'reload',
    execute(args, canvas, client, con, contenido, downloader, emojiStrip, fetch, fs, global, Intents, Jimp, Math, message, MessageAttachment, MessageCollector, MessageEmbed, MessageReaction, moment, msi, pdf, result, translate, webp) {
        if (message.author.id === '722810818823192629') {
            if (args[1] == 'cmd') {
                console.log('[LO] Intentado recargar el comando ' + args[2]);
                const commandName = args[0].toLowerCase();
                const command = message.client.commands.get(commandName)
                    || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) {
                    console.log('[ERR] Intentado recargar el módulo ' + args[2]);
                    return message.channel.send(`No existe ningún comando con ese nombre o alias \`${commandName}\`, ${message.author}!`);
                }

                const commandFolders = fs.readdirSync('./tools');
                const folderName = commandFolders.find(folder => fs.readdirSync(`./tools/`).includes(`${args[1]}.js`));

                delete require.cache[require.resolve(`../tools/${args[2]}.js`)];

                try {
                    const newCommand = require(`../tools/${args[2]}.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                    message.channel.send(`El comando \`${args[2]}\` ha sido recargado!`);
                    console.log('[OK] Recargar el módulo ' + args[2]);
                } catch (error) {
                    console.log('[ERR] Intentado recargar el módulo ' + args[2]);
                    message.channel.send(`se ha producido un error recargando el comando \`${args[1]}\`:\n\`${error.message}\``);
                }
            }
            if (args[1] == 'service') {
                console.log('[LO] Intentado recargar el servicio ' + args[2]);
                const commandName = args[0].toLowerCase();
                const command = message.client.commands.get(commandName)
                    || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) {
                    console.log('[ERR] Intentado recargar el servicio ' + args[2]);
                    return message.channel.send(`No existe ningún servicio con ese nombre o alias \`${commandName}\`, ${message.author}!`);
                }

                const commandFolders = fs.readdirSync('./services/');
                const folderName = commandFolders.find(folder => fs.readdirSync(`./services/`).includes(`${args[1]}.js`));

                delete require.cache[require.resolve(`../services/${args[2]}.js`)];

                try {
                    const newCommand = require(`../services/${args[2]}.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                    message.channel.send(`El servicio \`${args[2]}\` ha sido recargado!`);
                    console.log('[OK] Recargar el servicio ' + args[2]);
                } catch (error) {
                    console.log('[ERR] Intentado recargar el servicio ' + args[2]);
                    if (error.code === "MODULE_NOT_FOUND") {
                        message.channel.send(`:x: El servicio especificado no existe.`);
                    }
                }
            }
        } else {
            message.channel.send(':x: No dispone de permisos suficientes para ejecutar este comando')
        }
    }
}