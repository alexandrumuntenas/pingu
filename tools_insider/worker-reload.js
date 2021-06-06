const fs = require('fs');

module.exports = {
    name: 'worker-reload',
    execute(client, versionbot, build, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        if (message.author.id === '722810818823192629') {
            console.log('[LO] Intentado recargar el worker ' + args[1]);
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) {
                console.log('[ERR] Intentado recargar el worker ' + args[1]);
                return message.channel.send(`No existe ningún worker con ese nombre o alias \`${commandName}\`, ${message.author}!`);
            }

            const commandFolders = fs.readdirSync('./tools/workers');
            const folderName = commandFolders.find(folder => fs.readdirSync(`./tools/workers/`).includes(`${args[1]}.js`));

            delete require.cache[require.resolve(`../tools/workers/${args[1]}.js`)];

            try {
                const newCommand = require(`../tools/workers/${args[1]}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.channel.send(`El worker \`${args[1]}\` ha sido recargado!`);
                console.log('[OK] Recargar el worker ' + args[1]);
            } catch (error) {
                console.log('[ERR] Intentado recargar el worker ' + args[1]);
                message.channel.send(`se ha producido un error recargando el worker \`${args[1]}\`:\n\`${error.message}\``);
            }
        } else {
            message.channel.send(':x: No dispones de permisos suficientes para ejecutar este comando')
        }
    }
}