const { MessageEmbed } = require('discord.js')
const getLocales = require('../../i18n/getLocales')

module.exports.Status = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_null:876103457860370442> ${message}`)
}

module.exports.Loader = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<a:loader:871389840904695838> ${message}`)
}

module.exports.Success = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_on:876103503561502730> ${message}`)
}

module.exports.Error = (message) => {
  return new MessageEmbed()
    .setColor('#2F3136')
    .setDescription(`<:pingu_false:876103413526564924> ${message}`)
}

module.exports.info = {}

module.exports.info.help = (interaction, locale, syntax, options, nsfw, nsfwOptions) => {
  const sentEmbed = new MessageEmbed().setTitle('Help Tray')
  if (syntax) {
    sentEmbed.addField(getLocales(locale, 'COMMAND_HELP_SYNTAX'), `\`${syntax}\``)
  }

  if (options) {
    let avaliableOptions = ''
    options.forEach((object) => {
      avaliableOptions = avaliableOptions + ` \`${object.option || object}\``
    })
    sentEmbed.addField(getLocales(locale, 'COMMAND_HELP_SUBCATEGORIES'), avaliableOptions)
  }

  if (!nsfw) {
    sentEmbed.setColor('#2F3136')
  } else {
    sentEmbed.setColor('#B23CFD')
    if (nsfwOptions) {
      let avaliableOptions = ''
      nsfwOptions.forEach((object) => {
        avaliableOptions = avaliableOptions + ` \`${object.option || object}\``
      })
      sentEmbed.addField(getLocales(locale, 'COMMAND_HELP_NSFW_OPTIONS'), avaliableOptions)
    }
  }

  sentEmbed.setFooter(`<> => ${getLocales(locale, 'PARAMETER_NECESSARY')} | () => ${getLocales(locale, 'PAREMETER_OPTIONAL')}`)
  interaction.editReply({ embeds: [sentEmbed] })
}
