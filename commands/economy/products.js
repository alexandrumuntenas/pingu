const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const i18n = require('../../i18n/i18n')
const { getShopProduct } = require('../../modules/economy')

module.exports = {
  module: 'economy',
  name: 'products',
  description: '🛒 Configure the guild shop products',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  isConfigCommand: true,
  interactionData: new SlashCommandBuilder()
    .setName('products')
    .setDescription('🛒 Configure the guild shop products')
    .addSubcommandGroup(gr => gr.setName('create').setDescription('Create a new product')
      .addSubcommand(sc => sc
        .setName('collectionable').setDescription('🛒 Create a collectionable product')
        .addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))
        .addNumberOption(option => option.setName('price').setDescription('Product Price').setRequired(true))
        .addBooleanOption(option => option.setName('buyonlyone').setDescription('Should this product be purchased only once?').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Product Description'))
        .addStringOption(option => option.setName('image').setDescription('Product Image')))
      .addSubcommand(sc => sc.setName('role').setDescription('🛒 Create a product that gives a role')
        .addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))
        .addNumberOption(option => option.setName('price').setDescription('Product Price').setRequired(true))
        .addBooleanOption(option => option.setName('buyonlyone').setDescription('Should this product be purchased only once?').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select the role you want to be bought').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Product Description'))
        .addStringOption(option => option.setName('image').setDescription('Product Image')))
      .addSubcommand(sc => sc.setName('message').setDescription('🛒 Create a product that sends a message to a channel')
        .addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))
        .addNumberOption(option => option.setName('price').setDescription('Product Price').setRequired(true))
        .addBooleanOption(option => option.setName('buyOnlyOne').setDescription('Should this product be purchased only once?').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Select the message you want to be sent when the product is bought.').setRequired(true))
        .addChannelOption(option => option.setName('destination').setDescription('Select the channel where you want the message to be sent.').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Product Description'))
        .addStringOption(option => option.setName('image').setDescription('Product Image'))))
    .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete a product').addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'collectionable': {
        getShopProduct(client, interaction.guild, interaction.options.getString('name'), (fromDB) => {
          if (!fromDB) {
            const productMeta = {}

            if (interaction.options.getBoolean('buyOnlyOne')) productMeta.buyOnlyOne = true

            productMeta.buyOnlyOne = productMeta.buyOnlyOne || false

            client.pool.query('INSERT INTO `guildEconomyProducts` (`guild`, `productName`, `productDescription`, `productImage`, `productPrice`, `productMeta`) VALUES (?,?,?,?,?,?)', [interaction.guild.id, interaction.options.getString('name'), (interaction.options.getString('description') || null), (interaction.options.getString('image') || null), interaction.options.getNumber('price'), JSON.stringify(productMeta)], function (err) {
              if (err) client.logError(err)
              if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'PRODUCTS::CREATE:ERROR'))] })
              interaction.editReply({ embeds: [Success(i18n(locale, 'PRODUCTS::CREATE:SUCCESS', { PRODUCT: interaction.options.getString('name') }))] })
            })
          } else {
            interaction.editReply({ embeds: [Error(i18n(locale, 'PRODUCTS::CREATE:EXISTS', { PRODUCT: interaction.options.getString('name') }))] })
          }
        })
        break
      }
      case 'role': {
        getShopProduct(client, interaction.guild, interaction.options.getString('name'), (fromDB) => {
          if (!fromDB) {
            const productMeta = {}

            productMeta.action = {}

            productMeta.action.type = 'giveRole'
            productMeta.action.role = interaction.options.getRole('role').id

            if (interaction.options.getBoolean('buyOnlyOne')) productMeta.buyOnlyOne = true

            productMeta.buyOnlyOne = productMeta.buyOnlyOne || false

            client.pool.query('INSERT INTO `guildEconomyProducts` (`guild`, `productName`, `productDescription`, `productImage`, `productPrice`, `productMeta`) VALUES (?,?,?,?,?,?)', [interaction.guild.id, interaction.options.getString('name'), (interaction.options.getString('description') || null), (interaction.options.getString('image') || null), interaction.options.getNumber('price'), JSON.stringify(productMeta)], function (err) {
              if (err) client.logError(err)
              if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'PRODUCTS::CREATE:ERROR'))] })
              interaction.editReply({ embeds: [Success(i18n(locale, 'PRODUCTS::CREATE:SUCCESS', { PRODUCT: interaction.options.getRole('role') }))] })
            })
          } else {
            interaction.editReply({ embeds: [Error(i18n(locale, 'PRODUCT::CREATE:EXITS', { PRODUCT: interaction.options.getString('role') }))] })
          }
        })
        break
      }
      case 'message': {
        getShopProduct(client, interaction.guild, interaction.options.getString('name'), (fromDB) => {
          if (!fromDB) {
            const productMeta = {}

            productMeta.action = {}

            productMeta.action.type = 'sendMessage'
            productMeta.action.channel = interaction.options.getChannel('destination').id
            productMeta.action.message = interaction.options.getString('message')

            if (interaction.options.getBoolean('buyOnlyOne')) productMeta.buyOnlyOne = true

            productMeta.buyOnlyOne = productMeta.buyOnlyOne || false

            client.pool.query('INSERT INTO `guildEconomyProducts` (`guild`, `productName`, `productDescription`, `productImage`, `productPrice`, `productMeta`) VALUES (?,?,?,?,?,?)', [interaction.guild.id, interaction.options.getString('name'), (interaction.options.getString('description') || null), (interaction.options.getString('image') || null), interaction.options.getNumber('price'), JSON.stringify(productMeta)], function (err) {
              if (err) client.logError(err)
              if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'PRODUCTS::CREATE:ERROR'))] })
              interaction.editReply({ embeds: [Success(i18n(locale, 'PRODUCTS::CREATE:SUCCESS', { PRODUCT: interaction.options.getString('message') }))] })
            })
          } else {
            interaction.editReply({ embeds: [Error(i18n(locale, 'PRODUCTS::CREATE:EXISTS', { PRODUCT: interaction.options.getString('name') }))] })
          }
        })
        break
      }
      case 'delete': {
        client.pool.query('DELETE FROM `guildEconomyProducts` WHERE `productName` = ? AND `guild` = ?', [interaction.options.getString('name'), interaction.guild.id], function (err) {
          if (err) client.logError(err)
          if (err) return interaction.editReply({ embeds: [Error(i18n(locale, 'PRODUCTS::DELETE:ERROR'))] })
          interaction.editReply({ embeds: [Success(i18n(locale, 'PRODUCTS::DELETE:SUCCESS', { PRODUCT: interaction.options.getString('name') }))] })
        })
        break
      }
    }
  }
}
