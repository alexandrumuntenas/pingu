const { MessageEmbed } = require('discord.js');
const { getWorkMoney } = require('../../modules/economy');
const genericMessages = require('../../functions/genericMessages');
const getLocales = require('../../i18n/getLocales');

module.exports = {
  module: 'economy',
  name: 'work',
  description: '🏗️ Work to get some money!',
  cooldown: 3600000,
  executeInteraction(client, locale, interaction) {
    if (interaction.database.economyEnabled !== 0) {
      getWorkMoney(client, interaction.member, interaction.guild, (money) => {
        const inventoryEmbed = new MessageEmbed()
          .setAuthor(interaction.member.displayName, interaction.user.displayAvatarURL())
          .setColor('#633bdf')
          .setDescription(getLocales(locale, 'WORK', { WORK: `${money} ${interaction.database.economyCurrencyIcon}` }))
          .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png');
        interaction.editReply({ embeds: [inventoryEmbed] });
      });
    } else {
      genericMessages.error.noavaliable(interaction, locale);
    }
  },
  executeLegacy(client, locale, message) {
    if (message.database.economyEnabled !== 0) {
      getWorkMoney(client, message.member, message.guild, (money) => {
        const inventoryEmbed = new MessageEmbed()
          .setAuthor(message.member.displayName, message.author.displayAvatarURL())
          .setColor('#633bdf')
          .setDescription(getLocales(locale, 'WORK', { WORK: `${money} ${message.database.economyCurrencyIcon}` }))
          .setFooter('Powered by Pingu', 'https://cdn.discordapp.com/attachments/907917245567598592/907917308620587059/Instagram_Profiles1.png');
        message.reply({ embeds: [inventoryEmbed] });
      });
    } else {
      genericMessages.legacy.error.noavaliable(message, locale);
    }
  }
};
