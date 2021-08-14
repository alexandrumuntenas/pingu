module.exports = {
    name: 'unbanall',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].idioma}.json`);
        var noavaliable = lan.tools.noavaliable;
        lan = lan.tools.security.unbanall;
        if (result[0].moderador_activado != 0) {
            if (message.member.hasPermission("ADMINISTRATOR")) {
                message.guild.fetchBans().then(bans => {
                    if (bans.size == 0) { message.channel.send(`:neutral_face: ${lan.nousers}`); };
                    bans.forEach(ban => {
                        message.guild.members.unban(ban.user.id);
                    })
                }).then(() => message.channel.send(`<:pingu_check:876104161794596964> ${lan.success}`)).catch(e => console.log(e))
            } else {
                message.channel.send(`<:pingu_cross:876104109256769546> ${lan.permerror}`);
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${noavaliable}`);
        }
    }
}