const { SlashCommandBuilder } = require('@discordjs/builders')
const { buyItem } = require('../../modules/economy')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')

module.exports = {
  module: 'economy',
  name: 'buy',
  description: '💳 Buy a shop product',
  cooldown: 5000,
  interactionData: new SlashCommandBuilder()
    .setName('buy').setDescription('💳 Buy a shop product')
    .addStringOption(option => option.setName('productname').setDescription('Enter the product name you want to buy'))
    .addStringOption(option => option.setName('properties').setDescription('Additional properties needed to buy the product')),
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      if (interaction.options.getString('productname')) {
        try {
          buyItem(client, interaction.member, interaction.guild, interaction.options.getString('productname'), interaction.options.getString('properties'), (err) => {
            if (err.message === 'ECO_200') { interaction.editReply({ embeds: [Success(i18n(locale, 'BUY::SUCCESS', { ITEM: interaction.options.getString('productName') }))] }) } else interaction.editReply({ embeds: [Error(i18n(locale, 'BUY::ERROR', { ITEM: err.message }))] })
          })
        } catch (error) {
          interaction.channel.send(error)
        }
      } else {
        client.commands.get('shop').executeInteraction(client, locale, interaction)
      }
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
