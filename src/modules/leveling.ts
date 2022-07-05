import { Guild, GuildMember } from 'discord.js'
import EventHook from '../classes/EventHook'
import { ClientCooldownManager } from '../client'
import Command from '../core/classes/Command'
import Module from '../core/classes/Module'
import Consolex from '../core/consolex'
import { PoolConnection } from '../core/databaseManager'
import reemplazarPlaceholdersConDatosReales from '../core/utils/reemplazarPlaceholdersConDatosReales'
import { PinguMessage } from '../events/messageCreate'

async function obtenerDatosDelUsuario(guild: Guild, member: GuildMember): Promise<{ guild: string; member: string; level: string; experience: string }> {
  PoolConnection.execute('SELECT * FROM memberLevelingData WHERE guild = ? AND member = ? LIMIT 1', [guild.id, member.id]).then((rawMemberLevelingData) => {
    if (Object.prototype.hasOwnProperty.call(rawMemberLevelingData, '0')) return rawMemberLevelingData
    return { guild: guild.id, member: member.id, experience: '0', level: '1' }
  }).catch((error) => Consolex.gestionarError(error))
}

async function actualizarDatosDelUsuario(guild: Guild, member: GuildMember, experience: string, level: string) {
  PoolConnection.execute('UPDATE `memberLevelingData` SET `level`= ?,`experience`= ? WHERE guild = ? AND member = ?', [level, experience, guild.id, member.id]).then(() => {
    return { guild: guild.id, member: member.id, experience, level }
  }).catch((error) => Consolex.gestionarError(error))
}

async function obtenerExperiencia(message: PinguMessage) {
  if (message.guildConfiguration.leveling.enabled) {
    if (ClientCooldownManager.check(message.member, message.guild, 'leveling.obtenerExperiencia')) {
      obtenerDatosDelUsuario(message.guild, message.member).then((memberLevelingData) => {
        const newExperience = Math.floor(Math.random() * 25) + parseInt(memberLevelingData.experience, 10)
        const userLevelParsed = parseInt(memberLevelingData.level, 10)

        if (newExperience >= (((userLevelParsed + 1) ^ 2) * message.guildConfiguration.leveling.difficulty) * 100) {
          actualizarDatosDelUsuario(message.guild, message.member, newExperience.toString(), (userLevelParsed + 1).toString())
        } else {
          actualizarDatosDelUsuario(message.guild, message.member, newExperience.toString(), userLevelParsed.toString())
        }

        ClientCooldownManager.add(message.member, message.guild, new Command({ name: 'leveling.obtenerExperiencia', description: 'Obtener experiencia', cooldown: 60000 }))
      }
      )
    }
  }
}

export default new Module(
  'Leveling',
  'Leveling',
  [new EventHook('messageCreate', obtenerExperiencia, 'noPrefix')],
  {
    enabled: 'boolean',
    channel: 'string',
    message: 'string',
    difficulty: 'number',
    card: {
      background: 'string',
      overlay: { color: 'string', opacity: 'number' }
    }
  },
  {
    enabled: false,
    channel: '0000000000',
    message: 'GG {user}, you just advanced to level {newlevel}!',
    difficulty: 1,
    card: {
      background:
        'https://raw.githubusercontent.com/alexandrumuntenas/pingu/main/setup/defaultresourcesforguilds/backgroundforlevelingcards.jpg',
      overlay: { color: '#030305', opacity: 75 }
    }
  }
)

async function sendLevelUpMessage(message: PinguMessage) {
  obtenerDatosDelUsuario(message.guild, message.member).then((memberLevelingData) => {
    const channelWhereLevelUpMessageIsSent = message.guild?.channels.cache.get(message.guildConfiguration.leveling.channel)

    const content = reemplazarPlaceholdersConDatosReales(
      message.guildConfiguration.leveling.message ||
      'GG {player}, you just advanced to level {level}!',
      message.member,
      {
        newlevel: (parseInt(memberData.level, 10) + 1).toString(),
        oldlevel: parseInt(memberData.level, 10)
      }
    )

    if (channelWhereLevelUpMessageIsSent) {
      channelWhereLevelUpMessageIsSent.send({ content })
    } else {
      switch (message.guildConfiguration.leveling.channel) {
        case 'same': {
          message.reply({ content })
          break
        }
        case 'dm': {
          try {
            message.author.send({ content })
          } catch (err) {
            Consolex.debug('Error al intentar entregar mensaje de avance de nivel a un usuario')
          }
          break
        }
        default: {
          break
        }
      }
    }
  })
}

/**
 * @param {Guild} guild
 */

module.exports.getLeaderboard = async (guild) => {
  try {
    const [members] = await Database.execute(
      'SELECT * FROM `memberData` WHERE guild = ? ORDER BY CAST(lvlLevel AS unsigned) DESC, CAST(lvlExperience AS unsigned) DESC LIMIT 25',
      [guild.id]
    ).then((result) =>
      Object.prototype.hasOwnProperty.call(result, 'length') ? result : []
    )

    let memberCount = 0
    members.forEach(async (member) => {
      try {
        member.user = await Client.users.fetch(member.member) // skipcq: JS-0040
      } catch {
        member.user = { username: 'Mysterious User', discriminator: '0000' } // skipcq: JS-0040
      } finally {
        memberCount++
      }

      if (memberCount === members.length) return members
    })
  } catch (err) {
    consolex.gestionarError(err)
  }
}

registerFont('./fonts/Montserrat/Montserrat-SemiBold.ttf', {
  family: 'Montserrat'
})

function applyText(canvas, text, maxlimit) {
  const finalImageComposition = canvas.getContext('2d')
  let fontSize = maxlimit || 100

  do {
    finalImageComposition.font = `${(fontSize -= 1)}px "Montserrat SemiBold"`
  } while (finalImageComposition.measureText(text).width > canvas.width - 125)

  return finalImageComposition.font
}

// Code from https://stackoverflow.com/a/3368118/17821331
// eslint-disable-next-line max-params
function roundRect(
  finalImageComposition,
  x,
  y,
  width,
  height,
  radius,
  fill,
  stroke
) {
  if (typeof stroke === 'undefined') {
    stroke = true
  }

  if (typeof radius === 'undefined') {
    radius = 5
  }

  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
    // eslint-disable-next-line guard-for-in
    for (const side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side]
    }
  }

  finalImageComposition.beginPath()
  finalImageComposition.moveTo(x + radius.tl, y)
  finalImageComposition.lineTo(x + width - radius.tr, y)
  finalImageComposition.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius.tr
  )
  finalImageComposition.lineTo(x + width, y + height - radius.br)
  finalImageComposition.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  )
  finalImageComposition.lineTo(x + radius.bl, y + height)
  finalImageComposition.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius.bl
  )
  finalImageComposition.lineTo(x, y + radius.tl)
  finalImageComposition.quadraticCurveTo(x, y, x + radius.tl, y)
  finalImageComposition.closePath()
  if (fill) {
    finalImageComposition.fill()
  }

  if (stroke) {
    finalImageComposition.stroke()
  }
}

/**
 * @param {GuildMember} member
 * @returns {String}
 */

module.exports.generateRankCard = async (member) => {
  obtenerDatosDelUsuario(member).then(async (memberData) => {
    const attachmentPath = `./temp/${randomstring.generate({
      charset: 'alphabetic'
    })}.png`

    const canvas = createCanvas(1100, 320)
    const finalImageComposition = canvas.getContext('2d')

    finalImageComposition.strokeStyle = 'rgba(0,0,0,0)'

    // Establecer fondo del canvas
    if (
      member.guild.configuration.leveling.card.background &&
      isValidUrl(member.guild.configuration.leveling.card.background) &&
      isImageUrl(member.guild.configuration.leveling.card.background)
    ) {
      const background = await loadImage(
        member.guild.configuration.leveling.card.background
      )
      const scale = Math.max(
        canvas.width / background.width,
        canvas.height / background.height
      )
      finalImageComposition.drawImage(
        background,
        canvas.width / 2 - (background.width / 2) * scale,
        canvas.height / 2 - (background.height / 2) * scale,
        background.width * scale,
        background.height * scale
      )

      finalImageComposition.fillStyle = hexToRgba(
        member.guild.configuration.leveling.card.overlay.color || '#272934',
        member.guild.configuration.leveling.card.overlay.opacity || 50
      )
      roundRect(
        finalImageComposition,
        16,
        16,
        1068,
        290,
        10,
        finalImageComposition.fillStyle,
        finalImageComposition.strokeStyle
      )
    } else {
      finalImageComposition.fillStyle =
        member.guild.configuration.leveling.card.overlay.color || '#272934'
      finalImageComposition.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Escribir usuario
    finalImageComposition.font = applyText(canvas, member.user.tag, 40)
    finalImageComposition.textAlign = 'left'
    finalImageComposition.fillStyle = 'rgba(255, 255, 255, 0.8)'
    finalImageComposition.fillText(`${member.user.tag}`, 295, 180, 500)

    // Escribir nivel, experiencia y rango
    finalImageComposition.font = '50px "Montserrat SemiBold"'
    finalImageComposition.fillStyle = 'rgba(255, 255, 255, 0.5)'
    finalImageComposition.textAlign = 'right'
    finalImageComposition.fillText(
      `Rank #${memberData.lvlRank}  Level ${millify(memberData.lvlLevel)}`,
      1050,
      100
    )

    // Escribir progreso actual (actual/necesario)
    const actualVSrequired = `${millify(memberData.lvlExperience)} / ${millify(
      memberData.lvlLevel *
      memberData.lvlLevel *
      member.guild.configuration.leveling.difficulty *
      100
    )} XP`

    finalImageComposition.font = '30px "Montserrat SemiBold"'
    finalImageComposition.textAlign = 'right'
    finalImageComposition.fillStyle = 'rgba(255, 255, 255, 0.8)'
    finalImageComposition.fillText(actualVSrequired, 1050, 180)

    // Añadir barra de progreso (backdrop)
    finalImageComposition.fillStyle = 'rgba(255,255,255, 0.3)'
    roundRect(
      finalImageComposition,
      295,
      200,
      755,
      70,
      10,
      finalImageComposition.fillStyle,
      finalImageComposition.strokeStyle
    )

    // Añadir barra de progreso
    finalImageComposition.fillStyle = 'rgb(255,255,255)'
    roundRect(
      finalImageComposition,
      295,
      200,
      Math.abs(
        memberData.lvlExperience /
        (memberData.lvlLevel *
          memberData.lvlLevel *
          member.guild.configuration.leveling.difficulty *
          100)
      ) * 755,
      70,
      10,
      finalImageComposition.fillStyle,
      finalImageComposition.strokeStyle
    )

    // Añadir avatar de usuario
    finalImageComposition.beginPath()
    finalImageComposition.arc(159, 159, 102, 0, Math.PI * 2, true)
    finalImageComposition.closePath()
    finalImageComposition.clip()

    const avatar = await loadImage(
      member.user.displayAvatarURL({ format: 'png', size: 512 })
    )
    finalImageComposition.drawImage(avatar, 57, 57, 204, 204)

    const buffer = canvas.toBuffer('image/png')
    writeFileSync(attachmentPath, buffer)

    return attachmentPath
  })
}

/**
 * @param {Guild} guild
 */

module.exports.resetLeaderboard = (guild) => {
  if (!guild) throw new Error('Guild is required.')

  Database.execute('DELETE FROM memberData WHERE guild = ?', [guild.id]).catch(
    (err) => consolex.gestionarError(err)
  )
}
