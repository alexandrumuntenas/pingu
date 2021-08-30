const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'clear-server-warns',
  execute (args, client, con, contenido, message, result) {
    const i18n = require(`../../i18n/${result[0].guild_language}.json`).tools.security.clearserverwarns
    // const i18n = require(`../../i18n/${result[0].guildLanguage}.json`)
    const messageSent = new MessageEmbed()
    if (message.author.id === message.guild.ownerId) {
      con.query('DELETE FROM `guildWarns` WHERE guild = ?', [message.guild.id], function (err) {
        if (err) {
          console.log(err)
          message.channel.send('ERROR. Ignore the next embed')
        }
      })
      messageSent.setColor('#238636')
      messageSent.setDescription(`<:pingu_check:876104161794596964> ${i18n.success}`)
    } else {
      messageSent.setColor('#F85149')
      messageSent.setDescription(`<:pingu_cross:876104109256769546> ${i18n.permerror}`)
    }
    message.channel.send({ embeds: [messageSent] })
  }
}
