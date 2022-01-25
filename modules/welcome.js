/**
 * Give all the configured roles to the new member
 * @param {GuildMember} member
 */

const { getGuildConfigNext } = require("../functions/guildDataManager")

module.exports.giveMemberRoles = (member) => {
  getGuildConfigNext(member.guild, (guildConfig) => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, 'welcome') && Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'enabled')) {
      if (Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'roles')) {
        if (guildConfig.welcome.roles.length > 0) {
          guildConfig.welcome.roles.forEach(role => {
            const roleToGive = member.guild.roles.cache.get(role)
            if (roleToGive) {
              member.roles.add(roleToGive)
            }
          })
        }
      }
    }
  })
} // All this function was made by GH Copilot

const { MessageAttachment } = require('discord.js')

/**
 * Send the welcome message to the channel configured in the guild
 * @param {GuildMember} member
 */

module.exports.sendWelcomeMessage = (member) => {
  getGuildConfigNext(member.guild, (guildConfig) => {
    if (!Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'channel')) {
      return
    }

    const channel = member.guild.channels.cache.get(guildConfig.welcome.channel)

    if (!channel) {
      return
    }

    const message = { content: replaceBracePlaceholdersWithActualData(guildConfig.welcome.message || '{member} joined {server}!', member) }

    if (Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'card') && Object.prototype.hasOwnProperty.call(guildConfig.welcome.card, 'enabled')) {
      this.generateWelcomeCard(member, (paths) => {
        message.files = [new MessageAttachment(paths.attachmentSent)]
      })
    }

    channel.send(message)
  })
}

/**
 * Replace in the welcome message all the brace placeholders with the actual data.
 * Known placeholders: {member} GuildMember, {guild-member-count} The guild member count ,{guild} Guild name
 * @param {String} message
 * @param {GuildMember} member
 */

function replaceBracePlaceholdersWithActualData(message, member) {
  return message.replace('{member}', `<@${member.user.id}>`).replace('{guild}', `${member.guild.name}`)
}

/**
 * Create the member welcome card
 * @param {GuildMember} member
 */

const { registerFont, createCanvas, loadImage } = require("canvas");
const { writeFileSync } = require("fs");
const randomstring = require("randomstring");
const isValidUrl = require("is-valid-http-url");
const isImageUrl = require("is-image-url");
const hexToRgba = require("hex-rgba");

registerFont("./modules/sources/fonts/Montserrat/Montserrat-SemiBold.ttf", {
  family: "Montserrat",
});

module.exports.generateWelcomeCard = (member) => {
  getGuildConfigNext(member.guild, async (guildConfig) => {
    const attachmentPath = `./modules/temp/${randomstring.generate({ charset: "alphabetic" })}.png`

    const canvas = createCanvas(1100, 500);
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "rgba(0,0,0,0)";

    if (
      guildConfig.welcome.card.background &&
      isValidUrl(guildConfig.welcome.card.background) &&
      isImageUrl(guildConfig.welcome.card.background)
    ) {
      const background = await loadImage(guildConfig.welcome.card.background);
      const scale = Math.max(
        canvas.width / background.width,
        canvas.height / background.height
      );
      ctx.drawImage(
        background,
        canvas.width / 2 - (background.width / 2) * scale,
        canvas.height / 2 - (background.height / 2) * scale,
        background.width * scale,
        background.height * scale
      );
      ctx.fillStyle = hexToRgba(
        guildConfig.welcome.card.overlaycolor || "#272934",
        guildConfig.welcome.card.overlayopacity || 50
      );
      roundRect(ctx, 25, 25, 1050, 450, 10, ctx.fillStyle, ctx.strokeStyle);
    } else {
      ctx.fillStyle = guildConfig.welcome.card.overlaycolor || "#272934";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const title = guildConfig.welcome.card.title || `${member.user.tag} just joined the server`;
    const subtitle = guildConfig.welcome.card.subtitle || `Member #${member.guild.memberCount}`;

    ctx.font = applyText(canvas, title);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, 387);

    ctx.font = '30px "Montserrat SemiBold"';
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(subtitle, canvas.width / 2, 437);

    // Añadir avatar de usuario
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 175, 125, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 175, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await loadImage(
      member.user.displayAvatarURL({ format: "png", size: 512 })
    );
    ctx.drawImage(avatar, canvas.width / 2 - 100, 75, 200, 200);

    const buffer = canvas.toBuffer("image/png");
    writeFileSync(attachmentPath, buffer);

    return attachmentPath;
  })
}

function applyText(canvas, text, maxlimit) {
  const ctx = canvas.getContext("2d");
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
  if (typeof stroke === "undefined") {
    stroke = true;
  }

  if (typeof radius === "undefined") {
    radius = 5;
  }

  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
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
    y + height
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

/**
 * Do all the stuff that should be done when a member joins the guild
 * @param {GuildMember} member
 */

module.exports.doGuildMemberAdd = (member) => {
  getGuildConfigNext(member.guild, (guildConfig) => {
    if (Object.prototype.hasOwnProperty.call(guildConfig, 'welcome') && Object.prototype.hasOwnProperty.call(guildConfig.welcome, 'enabled')) {
      if (guildConfig.welcome.enabled) {
        this.giveMemberRoles(member)
        this.sendWelcomeMessage(member)
      }
    }
  })
}