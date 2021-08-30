const { MessageEmbed } = require('discord.js')
const getLocales = require('./getLocales')

module.exports = {
  Error: {
    no_avaliable: (message, locale) => {
      const sent = new MessageEmbed()
        .setColor('#DC3545')
        .setDescription(`<:pingu_false:876103413526564924> ${getLocales(locale, 'COMMNAD_NO_AVALIABLE')}`)
      message.reply({ embeds: [sent] })
    },
    permerror: (message, locale) => {
      const sent = new MessageEmbed()
        .setColor('#DC3545')
        .setDescription(`<:pingu_false:876103413526564924> ${getLocales(locale, 'COMMAND_PERMISSION_ERROR')}`)
      message.reply({ embeds: [sent] })
    },
    customerror: (message, locale, key) => {
      const sent = new MessageEmbed()
        .setColor('#DC3545')
        .setDescription(`<:pingu_false:876103413526564924> ${getLocales(locale, key)}`)
      message.reply({ embeds: [sent] })
    }
  },
  Info: {
    help: (message, locale, syntax, options, nsfw, nsfwOptions) => {
      const sentEmbed = new MessageEmbed().setTitle('Help Tray')
      if (syntax) {
        sentEmbed.addField(getLocales(locale, 'COMMAND_HELP_SYNTAX'), syntax)
      }

      if (options) {
        let avaliableOptions = ''
        options.forEach((option) => {
          avaliableOptions = avaliableOptions + ` \`${option}\``
        })
        sentEmbed.addField(getLocales(locale, 'COMMAND_HELP_SUBCATEGORIES'), avaliableOptions)
      }

      if (!nsfw) {
        sentEmbed.setColor('#17A2B8')
      } else {
        sentEmbed.setColor('#B23CFD')
        if (nsfwOptions) {
          let avaliableOptions = ''
          nsfwOptions.forEach((option) => {
            avaliableOptions = avaliableOptions + ` \`${option}\``
          })
          sentEmbed.addField(getLocales(locale, 'COMMAND_HELP_NSFW_OPTIONS'), avaliableOptions)
        }
      }

      sentEmbed.setFooter(`<> => ${getLocales(locale, 'PARAMETER_NECESSARY')} | () => ${getLocales(locale, 'PAREMETER_OPTIONAL')}`)
      message.reply({ embeds: [sentEmbed] })
    }
  }
}
