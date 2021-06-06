module.exports = {
    name: 'sobre',
    execute(client, versionbot, build, con, Math, Jimp, downloader, webp, fs, pdf, moment, msi, emojiStrip, message, args, contenido, result, Intents, MessageEmbed, MessageReaction, MessageCollector, MessageAttachment, global) {
        const filterLevels = {
            DISABLED: 'Off',
            MEMBERS_WITHOUT_ROLES: 'No Role',
            ALL_MEMBERS: 'Everyone'
        };

        const verificationLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: '(╯°□°）╯︵ ┻━┻',
            VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        };

        const regions = {
            brazil: 'Brazil',
            europe: 'Europe',
            hongkong: 'Hong Kong',
            india: 'India',
            japan: 'Japan',
            russia: 'Russia',
            singapore: 'Singapore',
            southafrica: 'South Africa',
            sydeny: 'Sydeny',
            'us-central': 'US Central',
            'us-east': 'US East',
            'us-west': 'US West',
            'us-south': 'US South'
        };
        async function binfo() {
            let totalMembers = 0

            totalMembers += (await message.guild.members.fetch()).size

            const embed = new MessageEmbed()
                .setAuthor(
                    `Información sobre ${client.user.username}`,
                    client.user.displayAvatarURL())
                .addFields(
                    {
                        name: '¿Quiere añadirme a su servidor?',
                        value: 'https://discord.com/oauth2/authorize?client_id=827199539185975417&permissions=1933044831&scope=bot%20applications.commands',
                    },
                    {
                        name: 'Documentación',
                        value: `https://wiredpenguin.duoestudios.es`,
                    },
                    {
                        name: 'Version',
                        value: versionbot,
                    },
                    {
                        name: 'Nombre de compilación',
                        value: build,
                    },
                    {
                        name: 'Desarrollado por',
                        value: '<@722810818823192629>'
                    },
                    {
                        name: 'Ayudando a más de',
                        value: client.guilds.cache.size + ' servidores'
                    },
                    {
                        name: 'Tiempo conectado...',
                        value: `${process.uptime().toFixed(2)}s`,
                    },
                )
            message.channel.send(embed)
        }
        binfo();
    }
}