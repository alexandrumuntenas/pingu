module.exports = {
    name: 'id',
    execute(args, client, con, contenido, message, result) {
        var lan = require(`../../languages/${result[0].guild_language}.json`);
        lan = lan.tools.misc.id;
        let server = message.guild.id;
        message.channel.send(`<:win_information:876119543968305233> ${lan} \`${server}\``);
    }
}