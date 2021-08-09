const makeId = require('../../gen/makeId');

module.exports = {
    name: 'config',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        lan = lan.tools.config;
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            var claveiande = makeId(25);
            con.query("INSERT INTO `sessions_apolo` (`Clave_de_Acceso`,`Guild_ID`) VALUES ('" + claveiande + "','" + message.guild.id + "')");
            message.author.send(`**Pingu · ${lan.configPanel}**\n ${lan.configToken}: \`${claveiande}\`\n ${lan.configUrl}: https://pingu.duoestudios.com\n ${lan.configIntructions}`);
            setTimeout(() => {
                con.query("DELETE FROM `sessions_apolo` WHERE Clave_de_Acceso = '" + claveiande + "'");
            }, 600000);
        } else {
            message.channel.send(`:x: ${lan.permerror}`)
        }
    }
}