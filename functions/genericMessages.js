const { MessageEmbed } = require('discord.js')
const humanizeduration = require('humanize-duration')
const getLocales = require('../i18n/getLocales')

module.exports = {
  Info: {
    help: (message, locale, syntax, options, nsfw, nsfwOptions) => {
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
        sentEmbed.setColor('BLURPLE')
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
      message.reply({ embeds: [sentEmbed] })
    },
    status: (message, text) => {
      const sentEmbed = new MessageEmbed()
        .setColor('BLURPLE')
        .setDescription(`<:pingu_null:876103457860370442> ${text}`)
      message.reply({ embeds: [sentEmbed] })
    }
  }
}

module.exports.success = (message, text) => {
  const sentEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setDescription(`<:pingu_on:876103503561502730> ${text}`)
  message.reply({ embeds: [sentEmbed] })
}

module.exports.error = (message, text) => {
  const sent = new MessageEmbed()
    .setColor('RED')
    .setDescription(`<:pingu_false:876103413526564924> ${text}`)
  message.reply({ embeds: [sent] })
}

module.exports.error.cooldown = (message, locale, cooldown) => {
  const sent = new MessageEmbed()
    .setColor('RED')
    .setDescription(`<:pingu_false:876103413526564924> ${getLocales(locale, 'COOLDOWN', { COOLDOWN: humanizeduration(cooldown, { round: true, language: locale, fallbacks: ['en'] }) })}`)
  message.reply({ embeds: [sent] })
}

module.exports.error.noavaliable = (message, locale) => {
  const sent = new MessageEmbed()
    .setColor('RED')
    .setDescription(`<:pingu_false:876103413526564924> ${getLocales(locale, 'COMMAND_NO_AVALIABLE')}`)
  message.reply({ embeds: [sent] })
}

module.exports.error.permissionerror = (message, locale) => {
  const sent = new MessageEmbed()
    .setColor('RED')
    .setDescription(`<:pingu_false:876103413526564924> ${getLocales(locale, 'COMMAND_PERMISSION_ERROR')}`)
  message.reply({ embeds: [sent] })
}
