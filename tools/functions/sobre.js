const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'sobre',
    execute(args, client, con, contenido, message, result) {
        const embed = new MessageEmbed()
            .setColor('#FFFFFF')
            .addFields(
                {
                    name: '<:Document_Folder:867318660679073812> Documentación',
                    value: `https://bit.ly/pingu_docs`,
                    inline: true
                },
                {
                    name: '<:upvote:867318329651888128> Votar en TOP.GG',
                    value: 'https://bit.ly/pingu_topgg',
                    inline: true
                },
                {
                    name: ':tools: Reportar errores',
                    value: 'https://bit.ly/pingu_dbug',
                    inline: true
                },
                {
                    name: ':satellite: ¿Quiere añadirme a su servidor?',
                    value: 'https://bit.ly/pingu_invite',
                    inline: true
                },
                {
                    name: ':speech_balloon: Servidor de soporte',
                    value: 'https://bit.ly/pingu_support',
                    inline: true
                },
                {
                    name: '<:language:868233627136315462> Mejorar traducciones',
                    value: 'https://bit.ly/pingu_languages',
                    inline: true
                }
            ).setFooter(`👪 Ayudando a más de ${client.guilds.cache.size} servidores`);
        message.channel.send(embed)
    }
}