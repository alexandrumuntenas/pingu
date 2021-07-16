module.exports = function (con, message) {
    console.log(message.channel.nsfw)
    if (!message.channel.nsfw) {
        con.query("SELECT * FROM `nsfw_checklist` WHERE 1", function (err, rows, fields) {
            rows.forEach(function (row) {
                if (message.content.includes(row.word_url)) {
                    message.channel.send(':face_with_monocle: No se permiten palabras/enlaces a páginas dónde se distribuyen documentales sobre apareamiento humano. Si desea distribuirlo, por favor, emplee los canales marcados como NSFW.');
                    message.delete();
                }
            });
        });
    }
}