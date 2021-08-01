const { MessageAttachment } = require('discord.js');
const fs = require('fs');
const Jimp = require('jimp');
const downloader = require('nodejs-file-downloader');
module.exports = function (result, client, con, message, global) {
    var cache = { "canal_id": result[0].niveles_canal_id, "canal_msg": result[0].niveles_canal_mensaje, "aspecto": result[0].niveles_fondo, "cartelactivado": result[0].niveles_cartel };
    var dif = result[0].niveles_dificultad;
    con.query("SELECT * FROM `leveling` WHERE guild = '" + message.guild.id + "' AND user = '" + message.author.id + "'", function (err, result) {
        if (result[0]) {
            var exp = parseInt(result[0].experiencia);
            var niv = parseInt(result[0].nivel);
            function randomNumber(min, max) {
                return Math.random() * (max - min) + min;
            }
            var exp = exp + Math.round(randomNumber(15, 25));
            if (exp >= (((niv * niv) * dif) * 100)) {
                var exp = 0;
                var niv = niv + 1;
                const fromdb = cache.canal_msg;
                const member = fromdb.replace('{user}', `<@${message.author.id}>`);
                const nivold = member.replace('{nivel-antiguo}', `${niv - 1}`);
                const toexport = nivold.replace('{nivel-nuevo}', `${niv}`);
                if (cache.canal_id) {
                    const mensaje = client.channels.cache.find(channel => channel.id === cache.canal_id);
                    mensaje.send(toexport);
                } else {
                    message.channel.send(toexport);
                }
            }
            var actualizardatos = "UPDATE `leveling` SET `experiencia` = '" + exp + "', `nivel` = '" + niv + "' WHERE `user` = '" + message.author.id + "' AND `guild` = '" + message.guild.id + "'";
            con.query(actualizardatos);
        } else {
            var newuser = "INSERT INTO `leveling` (`user`, `guild`) VALUES ('" + message.author.id + "', '" + message.guild.id + "')";
            con.query(newuser);
        }
    });
}