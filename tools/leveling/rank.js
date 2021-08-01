const canvacord = require('canvacord');
const downloader = require('nodejs-file-downloader');
const { MessageAttachment } = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'rank',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        var noavaliable = lan.tools.noavaliable;
        lan = lan.tools.leveling.rank;
        if (result[0].niveles_activado != 0) {
            var dif = result[0].niveles_dificultad;
            var cache = { "aspecto": result[0].niveles_fondo }
            if (message.mentions.users.first()) {
                if (message.mentions.users.first().bot) {
                    message.channel.send(`:information_source: ${lan.isbot}`);
                    return
                }
                con.query("SELECT * FROM `leveling` WHERE guild = '" + message.guild.id + "' AND user = '" + message.mentions.users.first().id + "'", function (err, result) {
                    if (result[0]) {
                        var experiencia = parseInt(result[0].experiencia);
                        var nivel = parseInt(result[0].nivel);
                        async function fa() {
                            const avatar = new downloader({
                                url: message.mentions.users.first().avatarURL({ format: 'jpg' }),
                                directory: "./usuarios/avatares/",
                                fileName: message.mentions.users.first().id + '_level.jpg',
                                cloneFiles: false,
                            });
                            try {
                                await avatar.download();
                                var rank = new canvacord.Rank()
                                    .setAvatar("./usuarios/avatares/" + message.mentions.users.first().id + "_level.jpg")
                                    .setCurrentXP(experiencia)
                                    .setRequiredXP(((nivel * nivel) * dif) * 100)
                                    .setStatus(message.mentions.users.first().presence.status, true)
                                    .setLevel(nivel, lan.level)
                                    .setProgressBar("#FFFFFF", "COLOR")
                                    .setUsername(message.mentions.users.first().username)
                                    .setDiscriminator(message.mentions.users.first().discriminator)
                                    .setRank(0, '', false)
                                    .setBackground("IMAGE", './recursos/carteles/' + cache.aspecto + '.png');

                                rank.build()
                                    .then(buffer => {
                                        canvacord.write(buffer, './usuarios/leveling/' + message.mentions.users.first().id + '_' + message.guild.id + '_rank.jpg');
                                        var attachament = new MessageAttachment('./usuarios/leveling/' + message.mentions.users.first().id + '_' + message.guild.id + '_rank.jpg');
                                        message.channel.send(attachament);
                                    });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        fa();
                    } else {
                        message.channel.send(":x: No existen datos disponibles.")
                    }
                })
            } else {
                con.query("SELECT * FROM `leveling` WHERE guild = '" + message.guild.id + "' AND user = '" + message.author.id + "'", function (err, result) {
                    if (result[0]) {
                        var experiencia = parseInt(result[0].experiencia);
                        var nivel = parseInt(result[0].nivel);
                        async function fa() {
                            const avatar = new downloader({
                                url: message.author.avatarURL({ format: 'jpg' }),
                                directory: "./usuarios/avatares/",
                                fileName: message.author.id + '_level.jpg',
                                cloneFiles: false,
                            });
                            try {
                                await avatar.download();
                                var rank = new canvacord.Rank()
                                    .setAvatar("./usuarios/avatares/" + message.author.id + "_level.jpg")
                                    .setCurrentXP(experiencia)
                                    .setRequiredXP(((nivel * nivel) * dif) * 100)
                                    .setStatus(message.author.presence.status, true)
                                    .setLevel(nivel, lan.level)
                                    .setProgressBar("#FFFFFF", "COLOR")
                                    .setUsername(message.author.username)
                                    .setDiscriminator(message.author.discriminator)
                                    .setRank(0, '', false)
                                    .setBackground("IMAGE", './recursos/carteles/' + cache.aspecto + '.png');

                                rank.build()
                                    .then(buffer => {
                                        canvacord.write(buffer, './usuarios/leveling/' + message.author.id + '_' + message.guild.id + '_rank.jpg');
                                        var attachament = new MessageAttachment('./usuarios/leveling/' + message.author.id + '_' + message.guild.id + '_rank.jpg');
                                        message.channel.send(attachament);
                                    });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        fa();
                    } else {
                        message.channel.send(`:information_source: ${lan.norank}`);
                    }
                })
            };
        } else {
            message.channel.send(`:x: ${noavaliable}`);
        }
    }
}