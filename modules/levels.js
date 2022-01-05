const talkedRecently = new Set()
const { registerFont, createCanvas, loadImage } = require('canvas')
const { writeFileSync } = require('fs')
const StackBlur = require('stackblur-canvas')
const randomstring = require('randomstring')
const isValidUrl = require('is-valid-http-url')
const isImageUrl = require('is-image-url')
const { millify } = require('millify')
const hexToRgba = require('hex-to-rgba')

registerFont('./modules/sources/fonts/Montserrat/Montserrat-SemiBold.ttf', { family: 'Montserrat' })

module.exports = {
  getMember: (client, member, callback) => {
    const lfM = client.Sentry.startTransaction({
      op: 'levels.getMember',
      name: 'levels (Get Member)'
    })
    client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? AND member = ?', [member.guild.id, member.id], (err, result) => {
      if (err) client.logError(err)
      if (Object.prototype.hasOwnProperty.call(result, 0)) {
        const adata = result[0]
        client.pool.query('SELECT member, ROW_NUMBER() OVER (ORDER BY memberLevel DESC, memberExperience DESC) AS rnk FROM guildLevelsData WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC', [member.guild.id], (err, result) => {
          if (err) client.logError(err)
          if (result && Object.prototype.hasOwnProperty.call(result, 0)) {
            result.filter(r => r.member === member.id).forEach(r => { adata.rank = r.rnk })
            callback(adata)
          } else {
            client.pool.query('INSERT INTO `guildLevelsData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], (err) => {
              if (err) {
                client.logError(err)
                client.log.error(err)
              }
              module.exports.getMember(client, member, callback)
            })
          }
        })
      } else {
        client.pool.query('INSERT INTO `guildLevelsData` (`guild`, `member`) VALUES (?, ?)', [member.guild.id, member.id], (err) => {
          if (err) {
            client.logError(err)
            client.log.error(err)
          }
          module.exports.getMember(client, member, callback)
        })
      }
    })
    lfM.finish()
  },
  updateMember: (client, member, newData, callback) => {
    const luM = client.Sentry.startTransaction({
      op: 'levels.updateMember',
      name: 'levels (Update Member)'
    })
    client.pool.query('UPDATE `guildLevelsData` SET `memberExperience` = ?, `memberLevel` = ? WHERE `guild` = ? AND `member` = ?', [newData.memberExperience, newData.memberLevel, member.guild.id, member.id], (err, result) => {
      let status
      if (err) {
        status = 500
        client.logError(err)
      } else {
        status = 200
      }
      callback(status)
    })
    luM.finish()
  },
  rankUp: function (client, message) {
    const lRU = client.Sentry.startTransaction({
      op: 'levels.rankup',
      name: 'levels (Rank Up)'
    })
    if (!message.content.startsWith(message.database.guildPrefix)) {
      if (!talkedRecently.has(`${message.member.id}_${message.guild.id}`)) {
        talkedRecently.add(`${message.member.id}_${message.guild.id}`)
        setTimeout(() => {
          talkedRecently.delete(`${message.member.id}_${message.guild.id}`)
        }, 60000)
        module.exports.getMember(client, message.member, (userData) => {
          if (userData) {
            let exp = parseInt(userData.memberExperience) + Math.round(Math.random() * (25 - 15) + 15)
            let niv = parseInt(userData.memberLevel)
            const dif = parseInt(message.database.levelsDifficulty)
            if (exp >= (((niv * niv) * dif) * 100)) {
              exp = exp - (((niv * niv) * dif) * 100)
              niv++
              const messageToSend = message.database.levelsMessage.replace('{member}', `<@${message.member.id}>`).replace('{oldlevel}', `${niv - 1}`).replace('{newlevel}', `${niv}`)
              if (message.database.levelsChannel === '1') {
                message.channel.send(messageToSend)
              } else {
                const customChannel = client.channels.cache.find(channel => channel.id === message.database.levelsChannel)
                if (customChannel) {
                  customChannel.send(messageToSend)
                } else {
                  message.channel.send(messageToSend)
                }
              }
            }
            module.exports.updateMember(client, message.member, { memberExperience: exp, memberLevel: niv }, () => { })
          }
        })
      }
    }
    lRU.finish()
  },
  generateRankCard: async (client, member, locale, database) => {
    const uniqueIdentifiers = {
      userAvatar: randomstring.generate({ charset: 'alphabetic' }),
      attachmentSent: randomstring.generate({ charset: 'alphabetic' })
    }

    const paths = {
      attachmentSent: `./modules/temp/${uniqueIdentifiers.attachmentSent}.png`
    }

    const canvas = createCanvas(1100, 320)
    const ctx = canvas.getContext('2d')

    // Establecer fondo del canvas
    let imgPath = ''
    if (database.levelsImageCustomBackground && isValidUrl(database.levelsImageCustomBackground) && isImageUrl(database.levelsImageCustomBackground)) {
      imgPath = database.levelsImageCustomBackground
      const background = await loadImage(imgPath)
      const scale = Math.max(canvas.width / background.width, canvas.height / background.height)
      ctx.drawImage(background, (canvas.width / 2) - (background.width / 2) * scale, (canvas.height / 2) - (background.height / 2) * scale, background.width * scale, background.height * scale)

      // Establecer blured overlay
      ctx.fillStyle = hexToRgba(database.levelsImageCustomOverlayColor || '#272934', (database.levelsImageCustomOpacity / 100))
      ctx.fillRect(25, 25, 1050, 270)
      StackBlur.canvasRGBA(canvas, 25, 25, 1050, 270, database.levelsImageCustomBlur)
      /* Next Release: 22T2
      ctx.fillRect(25, 25, 1050, 250)
      StackBlur.canvasRGBA(canvas, 25, 25, 1050, 250, database.levelsImageCustomBlur)
      */
    } else {
      ctx.fillStyle = '#272934'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Escribir usuario
    ctx.font = applyText(canvas, member.tag, 40)
    ctx.textAlign = 'left'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(`${member.tag}`, 295, 180, 500)

    // Escribir nivel, experiencia y rango

    ctx.font = '50px "Montserrat SemiBold"'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.textAlign = 'right'
    ctx.fillText(`Rank #${member.levelData.rank}  Level ${millify(member.levelData.memberLevel)}`, 1050, 100)

    // Escribir progreso actual (actual/necesario)
    const actualVSrequired = `${millify(member.levelData.memberExperience)} / ${millify(((member.levelData.memberLevel * member.levelData.memberLevel) * database.levelsDifficulty) * 100)} XP`

    ctx.font = '30px "Montserrat SemiBold"'
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(actualVSrequired, 1050, 180)

    // Añadir barra de progreso (backdrop)

    ctx.fillStyle = 'rgba(255,255,255, 0.3)'
    ctx.fillRect(295, 200, 755, 70)

    // Añadir barra de progreso

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(295, 200, (Math.abs((member.levelData.memberExperience) / (((member.levelData.memberLevel * member.levelData.memberLevel) * database.levelsDifficulty) * 100)) * 555), 70)

    // Escribir progreso actual (porcentaje)

    /* Next Release: 22T2
    ctx.fillStyle = 'rgba(255,255,255, 0.4)'
    ctx.fillRect(0, 300, 1100, 20)

    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(0, 300, (Math.abs((member.levelData.memberExperience) / (((member.levelData.memberLevel * member.levelData.memberLevel) * database.levelsDifficulty) * 100)) * 1100), 20)

    */

    // Añadir avatar de usuario

    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 }))
    ctx.drawImage(avatar, 50, 50, 220, 220)
    /* Next Release: 22T2
    ctx.drawImage(avatar, 50, 50, 200, 200)
    */

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(paths.attachmentSent, buffer)

    return paths
  },
  getLeaderboard (client, guild, callback) {
    client.pool.query('SELECT * FROM `guildLevelsData` WHERE guild = ? ORDER BY memberLevel DESC, memberExperience DESC LIMIT 25', [guild.id], (err, members) => {
      if (err) client.logError(err)
      if (callback && members && Object.prototype.hasOwnProperty.call(members, '1')) callback(members)
      else callback()
    })
  }
}

const applyText = (canvas, text, maxlimit) => {
  const ctx = canvas.getContext('2d')
  let fontSize = maxlimit || 100

  do {
    ctx.font = `${fontSize -= 1}px "Montserrat SemiBold"`
  } while (ctx.measureText(text).width > canvas.width - 125)

  return ctx.font
}
