const { SlashCommandBuilder } = require('@discordjs/builders')
const { Success, Error } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const { getMember, updateMember } = require('../../modules/memberManager')

module.exports = {
  module: 'economy',
  name: 'transfer',
  description: '📨 Send money to another user.',
  alias: [''],
  permissions: [],
  interactionData: new SlashCommandBuilder()
    .addUserOption(option => option.setName('user').setDescription('The user to send money to.').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The amount of money to send.').setRequired(true)),
  runInteraction(client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      if (!interaction.options.getUser('user').bot) {
        if (parseInt(interaction.options.getNumber('amount')) > 0) {
          getMember(client, interaction.member, (fromUserInventoryAndBalance) => {
            if (fromUserInventoryAndBalance.ecoBalance >= interaction.options.getNumber('amount')) {
              const toUser = interaction.options.getUser('user')
              toUser.guild = interaction.member.guild
              getMember(client, toUser, (toUserInventoryAndBalance) => {
                try {
                  updateMember(client, interaction.member, { ecoBalance: parseInt(fromUserInventoryAndBalance.ecoBalance) - interaction.options.getNumber('amount') })
                  updateMember(client, toUser, { ecoBalance: parseInt(toUserInventoryAndBalance.ecoBalance) + interaction.options.getNumber('amount') })
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
