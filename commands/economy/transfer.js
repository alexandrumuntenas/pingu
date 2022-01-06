const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Error } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const { getMemberInventoryAndBalance, updateMemberBalance } = require('../../modules/economy')

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
      if (!interaction.options.getUser('user').bot) {
        if (parseInt(interaction.options.getNumber('amount')) > 0) {
          getMemberInventoryAndBalance(client, interaction.member, (fromUserInventoryAndBalance) => {
            if (fromUserInventoryAndBalance.amount >= interaction.options.getNumber('amount')) {
              const toUser = interaction.options.getUser('user')
              toUser.guild = interaction.member.guild
              getMemberInventoryAndBalance(client, toUser, (toUserInventoryAndBalance) => {
                try {
                  updateMemberBalance(client, interaction.member, (parseInt(fromUserInventoryAndBalance.amount) - interaction.options.getNumber('amount')))
                  updateMemberBalance(client, toUser, (parseInt(toUserInventoryAndBalance.amount) + interaction.options.getNumber('amount')))
                  interaction.editReply({ embeds: [Success(i18n(locale, 'TRANSFER::SUCCESS', { USER: interaction.options.getUser('user') }))] })
                } catch (err) {
                  client.logError(err)
                  interaction.editReply({ embeds: [Error(i18n(locale, 'ERROR'))] })
                }
              })
            } else {
              interaction.editReply({ embeds: [Error(i18n(locale, 'TRANSFER::NOENOUGHMONEY'))] })
            }
          })
        } else {
          interaction.editReply({ embeds: [Error(i18n(locale, 'TRANSFER::INAVLIDAMOUNT'))] })
        }
      } else {
        interaction.editReply({ embeds: [Error(i18n(locale, 'TRANSFER::ISBOT'))] })
      }
    } else {
      interaction.editReply({ embeds: [Error(i18n(locale, 'COMMAND::NOAVALIABLE'))] })
    }
  }
}
