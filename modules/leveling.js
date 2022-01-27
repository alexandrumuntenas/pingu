const Client = require('../Client');
const Consolex = require('../functions/consolex');

/**
 * Get experiece by chatting.
 * @param {GuildMember} member
 */

const {getMember, updateMember} = require('../functions/memberManager');
const {getGuildConfigNext} = require('../functions/guildDataManager');

module.exports.getExperience = member => {
	getGuildConfigNext(member.guild, guildConfig => {
		getMember(member, memberData => {
			memberData.lvlExperience = parseInt(memberData.lvlExperience, 10) + Math.round((Math.random() * (25 - 15)) + 15);
			if (memberData.lvlExperience >= (((memberData.lvlExperience * memberData.lvlExperience) * guildConfig.leveling.difficulty) * 100)) {
				memberData.lvlExperience -= (((memberData.lvlExperience * memberData.lvlExperience) * guildConfig.leveling.difficulty) * 100);
				this.doLevelUp(member);
			}

			try {
				updateMember(member, {lvlExperience: memberData.lvlExperience});
			} catch (err) {
				if (err) {
					Consolex.handleError(err);
				}
			}
		});
	});
};

/**
 * Do level up.
 * @param {GuildMember} member
 */

module.exports.doLevelUp = member => {
	getMember(member, memberData => {
		updateMember(member, {lvlLevel: memberData.lvlLevel + 1});
	});
};

/**
 *  Get the guild leaderboard.
 * @param {Guild} guild
 * @param {Function} callback
 */

module.exports.getLeaderboard = (guild, callback) => {
	if (!callback) {
		throw new Error('Callback is required.');
	}

	Client.Database.query(
		'SELECT * FROM `memberData` WHERE guild = ? ORDER BY lvlLevel DESC, lvlExperience DESC LIMIT 25',
		[guild.id],
		(err, members) => {
			if (err) {
				Consolex.handleError(err);
			}

			if (
				callback
				&& members
				&& Object.prototype.hasOwnProperty.call(members, '0')
			) {
				callback(members);
			} else {
				callback();
			}
		},
	);
};

/**
 * Generate the rank card of the member.
 * @param {GuildMember} member
 * @param {Function} callback
 * @returns {String} The path of the rank card.
 */

const {registerFont, createCanvas, loadImage} = require('canvas');
const {writeFileSync} = require('fs');
const randomstring = require('randomstring');
const isValidUrl = require('is-valid-http-url');
const isImageUrl = require('is-image-url');
const hexToRgba = require('hex-rgba');
const {millify} = require('millify');

registerFont('./modules/sources/fonts/Montserrat/Montserrat-SemiBold.ttf', {
	family: 'Montserrat',
});

module.exports.generateRankCard = (member, callback) => {
	if (!callback) {
		throw new Error('Callback is required.');
	}

	getGuildConfigNext(member.guild, guildConfig => {
		getMember(member, async memberData => {
			const attachmentPath = `./modules/temp/${randomstring.generate({charset: 'alphabetic'})}.png`;
			const canvas = createCanvas(1100, 320);
			const ctx = canvas.getContext('2d');
			ctx.strokeStyle = 'rgba(0,0,0,0)';

			// Establecer fondo del canvas
			if (
				guildConfig.levelsImageCustomBackground
				&& isValidUrl(guildConfig.levelsImageCustomBackground)
				&& isImageUrl(guildConfig.levelsImageCustomBackground)
			) {
				const background = await loadImage(guildConfig.levelsImageCustomBackground);
				const scale = Math.max(
					canvas.width / background.width,
					canvas.height / background.height,
				);
				ctx.drawImage(
					background,
					(canvas.width / 2) - ((background.width / 2) * scale),
					(canvas.height / 2) - ((background.height / 2) * scale),
					background.width * scale,
					background.height * scale,
				);

				ctx.fillStyle = hexToRgba(
					guildConfig.levelsImageCustomOverlayColor || '#272934',
					guildConfig.levelsImageCustomOpacity || 50,
				);
				roundRect(ctx, 16, 16, 1068, 290, 10, ctx.fillStyle, ctx.strokeStyle);
			} else {
				ctx.fillStyle = guildConfig.levelsImageCustomOverlayColor || '#272934';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}

			// Escribir usuario
			ctx.font = applyText(canvas, member.tag, 40);
			ctx.textAlign = 'left';
			ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
			ctx.fillText(`${member.tag}`, 295, 180, 500);

			// Escribir nivel, experiencia y rango
			ctx.font = '50px "Montserrat SemiBold"';
			ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
			ctx.textAlign = 'right';
			ctx.fillText(
				`Rank #${memberData.lvlRank}  Level ${millify(
					memberData.lvlLevel,
				)}`,
				1050,
				100,
			);

			// Escribir progreso actual (actual/necesario)
			const actualVSrequired = `${millify(memberData.lvlExperience)} / ${millify(((memberData.lvlLevel * memberData.lvlLevel) * guildConfig.levelsDifficulty) * 100)} XP`;

			ctx.font = '30px "Montserrat SemiBold"';
			ctx.textAlign = 'right';
			ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
			ctx.fillText(actualVSrequired, 1050, 180);

			// Añadir barra de progreso (backdrop)
			ctx.fillStyle = 'rgba(255,255,255, 0.3)';
			roundRect(ctx, 295, 200, 755, 70, 10, ctx.fillStyle, ctx.strokeStyle);

			// Añadir barra de progreso
			ctx.fillStyle = 'rgb(255,255,255)';
			roundRect(ctx, 295,	200, Math.abs(memberData.lvlExperience / (((memberData.lvlLevel * memberData.lvlLevel) * guildConfig.levelsDifficulty) * 100)) * 755, 70, 10,	ctx.fillStyle, ctx.strokeStyle);

			// Añadir avatar de usuario
			ctx.beginPath();
			ctx.arc(159, 159, 102, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.clip();

			const avatar = await loadImage(
				member.user.displayAvatarURL({format: 'png', size: 512}),
			);
			ctx.drawImage(avatar, 57, 57, 204, 204);

			const buffer = canvas.toBuffer('image/png');
			writeFileSync(attachmentPath, buffer);

			callback(attachmentPath);
		});
	});
};

function applyText(canvas, text, maxlimit) {
	const ctx = canvas.getContext('2d');
	let fontSize = maxlimit || 100;

	do {
		ctx.font = `${(fontSize -= 1)}px "Montserrat SemiBold"`;
	} while (ctx.measureText(text).width > canvas.width - 125);

	return ctx.font;
}

// Code from https://stackoverflow.com/a/3368118/17821331
// Fix: Comprobar si se puede mejorar. ¡Eslint no para de gritar!
// eslint-disable-next-line max-params
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke === 'undefined') {
		stroke = true;
	}

	if (typeof radius === 'undefined') {
		radius = 5;
	}

	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		const defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		// eslint-disable-next-line guard-for-in
		for (const side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}

	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(
		x + width,
		y + height,
		x + width - radius.br,
		y + height,
	);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}

	if (stroke) {
		ctx.stroke();
	}
}
