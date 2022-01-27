const Client = require('../Client');
const {getMember, updateMember} = require('../functions/memberManager');

/**
 * Get work money.
 * @param {GuildMember} member
 * @returns {Number} The amount of money earned.
 */

module.exports.getWorkMoney = async member => {
	getMember(member, memberData => {
		const workMoney = Math.round((Math.random() * 100) + 15);
		updateMember(member, {ecoBalance: parseInt(memberData.ecoBalance, 10) + workMoney});
		return workMoney;
	});
};

/**
 * Get daily money.
 * @param {GuildMember} member
 * @returns {Number} The amount of money earned.
 */

module.exports.getDailyMoney = async member => {
	getMember(member, memberData => {
		const dailyMoney = Math.round((Math.random() * 100) + (Math.random() * 150) + 50);
		updateMember(member, {ecoBalance: parseInt(memberData.ecoBalance, 10) + dailyMoney});
		return dailyMoney;
	});
};

/**
 * Get the guild leaderboard.
 * @param {Guild} guild
 * @returns {Array} The guild leaderboard.
 */

module.exports.getLeaderboard = async guild => {
	Database.query(
		'SELECT * FROM `memberData` WHERE guild = ? ORDER BY lvlLevel DESC, lvlExperience DESC LIMIT 25',
		[guild.id],
		(err, members) => {
			if (err) {
				Consolex.handleError(err);
				throw new Error('Error getting leaderboard.');
			}

			if (members
        && Object.prototype.hasOwnProperty.call(members, '0')
			) {
				return members;
			}

			return [];
		},
	);
};

/**
 * Get all the products of the guild shop.
 * @param {Guild} guild
 * @returns {Array} The guild shop products.
 */

module.exports.fetchShopProducts = async guild => {
	Database.query('SELECT * FROM `guildEconomyProducts` WHERE `guild` = ?', [guild.id], (err, products) => {
		if (err) {
			Consolex.handleError(err);
		}

		if (products
      && Object.prototype.hasOwnProperty.call(products, '0')
		) {
			return products;
		}

		return [];
	});
};

/**
 * Get a guild shop product.
 * @param {Guild} guild
 * @param {String} productIdOrName
 */

module.exports.getShopProduct = async (guild, productIdOrName) => {
	Database.query('SELECT 1 FROM `guildEconomyProducts` WHERE `guild` = ? AND productId = ? OR productName = ?', [guild.id, productIdOrName, productIdOrName], (err, product) => {
		if (err) {
			Consolex.handleError(err);
		}

		if (Object.prototype.hasOwnProperty.call(product, '0')) {
			return product[0];
		}

		throw new Error('Product not found.');
	});
};

/**
 * Add an item to the inventory of a member.
 * @param {Object} originalInventory
 * @param {Object} productToAdd - Product to add to the inventory. It's the same as the one returned by getShopProduct.
 * @param {Function} callback
 * @returns {Object} The new inventory.
 */

function addItemToInventory(originalInventory, productToAdd, callback) {
	if (!(productToAdd || originalInventory || callback)) {
		throw new Error('Missing parameters.');
	}

	if (productToAdd.properties.shouldBePurchasedOnce) {
		if (!Object.prototype.hasOwnProperty.call(originalInventory, productToAdd.productId)) {
			originalInventory[productToAdd.productId] = 'OnlyOne';
		}
	} else {
		originalInventory[productToAdd.productId] = originalInventory[productToAdd.productId] + 1 || 1;
	}

	callback(originalInventory);
}

/**
 * Check if member has a product.
 * @param {GuildMember} member
 * @param {String} productIdOrName
 * @returns {Boolean} If the member has the product.
 */

module.exports.checkIfMemberHasProduct = (member, productIdOrName) => {
	getMember(member, memberData => {
		if (memberData.ecoInventory[productIdOrName]) {
			return true;
		}

		return false;
	});
};

/**
 * Check if the specified product has to be purchased once.
 * @param {Guild} guild
 * @param {String} productIdOrName
 * @returns {Boolean} If the product has to be purchased once.
 */

module.exports.checkIfTheShopProductShouldBePurchasedOnlyOnce = (guild, productIdOrName) => {
	this.getShopProduct(guild, productIdOrName, product => {
		if (product.properties.shouldBePurchasedOnce) {
			return true;
		}

		return false;
	});
};

/**
 * Execute the product functions.
 * @param {GuildMember} member
 * @param {String} productIdOrName
 * @param {Function} callback
 * @returns {Boolean} If the product was executed.
 */

module.exports.executeProductFunctions = (member, productIdOrName, callback) => {
	this.getShopProduct(member.guild, productIdOrName, product => {
		if (product.properties.actionOnPurchase) {
			//! REDESARROLLAR :D
		}
	});
};

/**
 * Buy a product.
 * @param {GuildMember} member
 * @param {String} productIdOrName
 * @param {Function} callback
 * @returns {Boolean} If the product was bought.
 */

module.exports.buyProduct = (member, productIdOrName) => {
	this.getShopProduct(member.guild, productIdOrName, product => {
		if (member.ecoBalance >= product.properties.price) {
			return false;
		}

		getMember(member, memberData => {
			if (this.checkIfTheShopProductShouldBePurchasedOnlyOnce(member.guild, productIdOrName) && this.checkIfMemberHasProduct(member, productIdOrName)) {
				throw new Error('Product already bought.');
			}

			addItemToInventory(memberData.ecoInventory, product, memberInventoryWithTheProduct => {
				updateMember(member, {ecoBalance: memberData.ecoBalance - product.properties.price, ecoInventory: memberInventoryWithTheProduct});
				this.executeProductFunctions(member, productIdOrName, allWentAsExpected => {
					if (allWentAsExpected) {
						return true;
					}

					updateMember(member, {ecoBalance: memberData.ecoBalance + product.properties.price, ecoInventory: memberData.ecoInventory});
				});
			});
		});
	});
};
