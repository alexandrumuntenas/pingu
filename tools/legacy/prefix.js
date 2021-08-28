module.exports = {
    name: 'prefix',
    execute (args, client, con, contenido, message, result) {
        let i18n = require(`../../i18n/${result[0].guild_language}.json`)
        i18n = i18n.tools.config.prefix
        message.channel.send(':warning: El comando `guild_prefix` será removido en la actualización 2109, que será implementada el 01/09/2021. (EOS 2109, más info en nuestro servidor de soporte)')
        if (message.guild.ownerID == message.author.id || message.member.hasPermission('ADMINISTRATOR')) {
            if (args[1]) {
                const sql = "UPDATE `guildData` SET `guild_prefix` = '" + args[1] + "' WHERE `guildData`.`guild` = '" + message.guild.id + "'"
                con.query(sql, function (err) {
                })
                message.channel.send(`<:pingu_check:876104161794596964> ${i18n.response}: \`${args[1]}\``)
            } else {
                message.channel.send(`<:win_information:876119543968305233> ${i18n.missing_arg}: \`${result[0].guild_prefix}prefix <new prefix>\``)
            }
        } else {
            message.channel.send(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
        }
    }
}
