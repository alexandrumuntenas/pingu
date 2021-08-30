const { Permissions, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'noMoreUsers',
  execute (args, client, con, locale, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.config.burbuja
    // const i18n = require(`../../i18n/${result[0].guildLanguage}.json`)
    const messageSent = new MessageEmbed()
    if (message.guild.ownerId === message.author.id || message.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR])) {
      const valor = result[0].moderator_noMoreUsers_enabled
      if (valor === 1) {
        messageSent.setColor('#F85149')
        con.query("UPDATE `guildData` SET `moderator_noMoreUsers_enabled` = '0' WHERE `guildData`.`guild` = ?", [message.guild.id])
        messageSent.setDescription(`<:pingu_check:876104161794596964> ${i18n.response_a}`)
        // messageSent.setAuthor(i18n.moduleDisabled)
      } else {
        messageSent.setColor('#238636')
        con.query("UPDATE `guildData` SET `moderator_noMoreUsers_enabled` = '1' WHERE `guildData`.`guild` = ?", [message.guild.id])
        messageSent.setDescription(`<:pingu_check:876104161794596964> ${i18n.response_b}`)
        // messageSent.setAuthor(i18n.moduleEnabled)
      }
    } else {
      messageSent.setColor('#F85149')
      messageSent.setDescription(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
    message.channel.send({ embeds: [messageSent] })
  }
}
