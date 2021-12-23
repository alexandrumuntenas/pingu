const { Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Error, Success } = require('../../modules/constructor/messageBuilder')
const getLocales = require('../../i18n/getLocales')
const { fetchShopProduct } = require('../../modules/economy')

module.exports = {
  module: 'economy',
  name: 'products',
  description: '🛒 Configure the guild shop products',
  permissions: [Permissions.FLAGS.MANAGE_GUILD],
  cooldown: 0,
  interactionData: new SlashCommandBuilder()
    .setName('products')
    .setDescription('🛒 Configure the guild shop products')
    .addSubcommandGroup(gr => gr.setName('create').setDescription('Create a new product')
      .addSubcommand(sc => sc
        .setName('collectionable').setDescription('🛒 Create a collectionable product')
        .addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))
        .addNumberOption(option => option.setName('price').setDescription('Product Price').setRequired(true))
        .addBooleanOption(option => option.setName('singlebuy').setDescription('Should this product be purchased only once?').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Product Description'))
        .addStringOption(option => option.setName('image').setDescription('Product Image')))
      .addSubcommand(sc => sc.setName('role').setDescription('🛒 Create a product that gives a role')
        .addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))
        .addNumberOption(option => option.setName('price').setDescription('Product Price').setRequired(true))
        .addBooleanOption(option => option.setName('singlebuy').setDescription('Should this product be purchased only once?').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Select the role you want to be bought').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Product Description'))
        .addStringOption(option => option.setName('image').setDescription('Product Image')))
      .addSubcommand(sc => sc.setName('message').setDescription('🛒 Create a product that sends a message to a channel')
        .addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))
        .addNumberOption(option => option.setName('price').setDescription('Product Price').setRequired(true))
        .addBooleanOption(option => option.setName('singlebuy').setDescription('Should this product be purchased only once?').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Select the message you want to be sent when the product is bought.').setRequired(true))
        .addChannelOption(option => option.setName('destination').setDescription('Select the channel where you want the message to be sent.').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Product Description'))
        .addStringOption(option => option.setName('properties').setDescription('Variables that users must define when buying the product. Example: `USER, NUMBER...`'))
        .addStringOption(option => option.setName('image').setDescription('Product Image'))))
    .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete a product').addStringOption(option => option.setName('name').setDescription('Product Name').setRequired(true))),
  executeInteraction (client, locale, interaction) {
    switch (interaction.options.getSubcommand()) {
      case 'collectionable': {
        fetchShopProduct(client, interaction.guild, interaction.options.getString('name'), (fromDB) => {
          if (!fromDB) {
            const productMeta = {}

            if (interaction.options.getBoolean('singlebuy')) productMeta.singlebuy = true

            productMeta.singlebuy = productMeta.singlebuy || false

            client.pool.query('INSERT INTO `guildEconomyProducts` (`guild`, `productName`, `productDescription`, `productImage`, `productPrice`, `productMeta`) VALUES (?,?,?,?,?,?)', [interaction.guild.id, interaction.options.getString('name'), (interaction.options.getString('description') || null), (interaction.options.getString('image') || null), interaction.options.getNumber('price'), JSON.stringify(productMeta)], function (err) {
              if (err) client.Sentry.captureException(err)
              interaction.editReply({ embeds: [Success(getLocales('PRODUCT_CREATE_SUCCESS', { PRODUCT: interaction.options.getString('name') }))] })
            })
          } else {
            interaction.editReply({ embeds: [Error(getLocales('PRODUCT_EXISTS', { PRODUCT: interaction.options.getString('name') }))] })
          }
        })
        break
      }
      case 'role': {
        fetchShopProduct(client, interaction.guild, interaction.options.getString('name'), (fromDB) => {
          if (!fromDB) {
            const productMeta = {}

            productMeta.action = {}

            productMeta.action.type = 'giveRole'
            productMeta.action.role = interaction.options.getRole('role').id

            if (interaction.options.getBoolean('singlebuy')) productMeta.singlebuy = true

            productMeta.singlebuy = productMeta.singlebuy || false

            client.pool.query('INSERT INTO `guildEconomyProducts` (`guild`, `productName`, `productDescription`, `productImage`, `productPrice`, `productMeta`) VALUES (?,?,?,?,?,?)', [interaction.guild.id, interaction.options.getString('name'), (interaction.options.getString('description') || null), (interaction.options.getString('image') || null), interaction.options.getNumber('price'), JSON.stringify(productMeta)], function (err) {
              if (err) client.Sentry.captureException(err)
              interaction.editReply({ embeds: [Success(getLocales('PRODUCT_CREATE_SUCCESS', { PRODUCT: interaction.options.getString('name') }))] })
            })
          } else {
            interaction.editReply({ embeds: [Error(getLocales('PRODUCT_EXISTS', { PRODUCT: interaction.options.getString('name') }))] })
          }
        })
        break
      }
      case 'message': {
        fetchShopProduct(client, interaction.guild, interaction.options.getString('name'), (fromDB) => {
          if (!fromDB) {
            const productMeta = {}

            productMeta.action = {}

            productMeta.action.type = 'sendMessage'
            productMeta.action.channel = interaction.options.getChannel('destination').id
            productMeta.action.message = interaction.options.getString('message')

            if (interaction.options.getBoolean('singlebuy')) productMeta.singlebuy = true
            if (interaction.options.getString('properties')) productMeta.properties = interaction.options.getString('properties').split(',')

            productMeta.singlebuy = productMeta.singlebuy || false

            client.pool.query('INSERT INTO `guildEconomyProducts` (`guild`, `productName`, `productDescription`, `productImage`, `productPrice`, `productMeta`) VALUES (?,?,?,?,?,?)', [interaction.guild.id, interaction.options.getString('name'), (interaction.options.getString('description') || null), (interaction.options.getString('image') || null), interaction.options.getNumber('price'), JSON.stringify(productMeta)], function (err) {
              if (err) client.Sentry.captureException(err)
              interaction.editReply({ embeds: [Success(getLocales(locale, 'PRODUCT_CREATE_SUCCESS', { PRODUCT: interaction.options.getString('name') }))] })
            })
          } else {
            interaction.editReply({ embeds: [Error(getLocales(locale, 'PRODUCT_EXISTS', { PRODUCT: interaction.options.getString('name') }))] })
          }
        })
        break
      }
      case 'delete': {
        client.pool.query('DELETE FROM `guildEconomyProducts` WHERE `productName` = ? AND `guild` = ?', [interaction.options.getString('name'), interaction.guild.id], function (err) {
          if (err) client.Sentry.captureException(err)
          interaction.editReply({ embeds: [Success(getLocales(locale, 'PRODUCT_REMOVE_SUCCESS', { PRODUCT: interaction.options.getString('name') }))] })
        })
        break
      }
    }
  }
}
