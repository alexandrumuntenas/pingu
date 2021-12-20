const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Error } = require('../../modules/constructor/messageBuilder')
const getLocales = require('../../i18n/getLocales')
const { makeMoneyTransferToUser } = require('../../modules/economy')

module.exports = {
  module: 'economy',
  name: 'transfer',
  description: '📨 Send money to another user.',
  alias: [''],
  permissions: [],
  interactionData: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('📨 Send money to another user.')
    .addUserOption(option => option.setName('user').setDescription('The user to send money to.').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The amount of money to send.').setRequired(true)),
  executeInteraction (client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      const userToSendMoney = interaction.options.getUser('user')
      const amount = interaction.options.getNumber('amount')
      if (!userToSendMoney.bot) {
        if (parseInt(amount) > 0) {
          makeMoneyTransferToUser(client, interaction.guild, interaction.member, userToSendMoney, amount, (status) => {
            if (status) {
              interaction.editReply({ embeds: [Success(getLocales(locale, 'TRANSFER_SUCCESS', { USER: userToSendMoney }))] })
            } else {
              interaction.editReply({ embeds: [Error(getLocales(locale, 'TRANSFER_NOENOUGHMONEY'))] })
            }
          })
        } else {
          interaction.editReply({ embeds: [Error(getLocales(locale, 'TRANSFER_INVALIDAMOUNT'))] })
        }
      } else {
        interaction.editReply({ embeds: [Error(getLocales(locale, 'TRANSFER_ISBOT'))] })
      }
    } else {
      interaction.editReply({ embeds: [Error(getLocales(locale, 'COMMAND_NO_AVALIABLE'))] })
    }
  }
}
