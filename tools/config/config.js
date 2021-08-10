const makeId = require('../../gen/makeId');

module.exports = {
    name: 'config',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            con.query("DELETE FROM `apolo_sessions` WHERE `Guild_ID` LIKE " + message.guild.id);
            var claveiande = makeId(25);
            var claveadmin = makeId(12);
            con.query("INSERT INTO `apolo_sessions` (`Clave_de_Acceso`,`Guild_ID`,`Solicitante_ID`, `Clave_de_Autorizacion`) VALUES ('" + claveiande + "','" + message.guild.id + "', '" + message.author.id + "', '" + claveadmin + "')");
            message.author.send(`:tools: **Pingu · ${lan.configPanel}**\n${lan.configToken}: \`${claveiande}\`\n${lan.configUrl}: https://pingu.duoestudios.com\n${lan.configInstructions}`);
            client.users.cache.get(message.guild.ownerID).send(`:tools: **Pingu · ${lan.configPanel}**\n*${message.author.tag}* ${lan.configAdminInstructions}: \`${claveadmin}\``);
            setTimeout(() => {
                con.query("DELETE FROM `apolo_sessions` WHERE Clave_de_Acceso = '" + claveiande + "'");
            }, 600000);
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}