import { Guild, GuildMember } from 'discord.js'
import { ClientCooldownManager, ClientGuildManager } from '../client'
import { PoolConnection } from '../core/databaseManager'
import { PinguMessage } from '../events/messageCreate'
import { registerFont, createCanvas, loadImage } from 'canvas'
import { writeFileSync } from 'fs'
import { ChannelType } from 'discord-api-types/v10'

import Module from '../core/classes/Module'
import Consolex from '../core/consolex'
import reemplazarPlaceholdersConDatosReales from '../core/utils/reemplazarPlaceholdersConDatosReales'
import rectangulosConBordesRedondeados from './utils/canvas/rectangulosConBordesRedondeados'
import applyText from './utils/canvas/applyText'
import millify from 'millify'

import * as randomstring from 'randomstring'
import EventHook from '../core/classes/EventHook'

const isValidUrl = require('is-valid-http-url')
const isImageUrl = require('is-image-url')
const hexToRgba = require('hex-rgba')

async function obtenerDatosDelUsuario (member: GuildMember | null): Promise<{ guild: string; member: string; level: string; experience: string, rank: string }> {
  if (!(member instanceof GuildMember)) throw new Error('El "Guild Member" especificado no existe.')

  const rawMemberLevelingData: { [index: string]: any } = await PoolConnection.execute('SELECT * FROM memberLevelingData WHERE guild = ? AND member = ? LIMIT 1', [member.guild.id, member.id]).then((result) => result[0]).catch((error) => Consolex.gestionarError(error))
  const memberLevelingData: { guild: string; member: string; level: string; experience: string, rank: string } = { guild: member.guild.id, member: member.id, level: rawMemberLevelingData.level, experience: rawMemberLevelingData.experience, rank: '0' }

  if (Object.prototype.hasOwnProperty.call(rawMemberLevelingData, '0')) return memberLevelingData
  return { guild: member.guild.id, member: member.id, experience: '0', level: '1', rank: '0' }
}

async function actualizarDatosDelUsuario (member: GuildMember | null, experience: string, level: string) {
  if (!(member instanceof GuildMember)) throw new Error('El "GuildMember" especificado no existe.')

  await PoolConnection.execute('UPDATE `memberLevelingData` SET `level`= ?,`experience`= ? WHERE guild = ? AND member = ?', [level, experience, member.guild.id, member.id]).catch((error) => Consolex.gestionarError(error))
  return { guild: member.guild.id, member: member.id, experience, level }
}

async function sendLevelUpMessage (message: PinguMessage) {
  const memberLevelingData = await obtenerDatosDelUsuario(message.member)
  const canalDondeSeEnviaElMensaje = message.guild?.channels.cache.get(message.guildConfiguration.leveling.channel)

  const content = reemplazarPlaceholdersConDatosReales(message.guildConfiguration.leveling.message || 'GG {player}, you just advanced to level {level}!', message.member,
    {
      newlevel: (parseInt(memberLevelingData.level, 10) + 1).toString(),
      oldlevel: parseInt(memberLevelingData.level, 10)
    }
  )

  if (canalDondeSeEnviaElMensaje && canalDondeSeEnviaElMensaje?.type === ChannelType.GuildText) {
    canalDondeSeEnviaElMensaje.send({ content })
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
}

async function obtenerExperiencia (message: PinguMessage) {
  if (message.guildConfiguration.leveling.enabled) {
    if (ClientCooldownManager.check(message.member, { name: 'leveling.obtenerExperiencia' })) {
      const memberLevelingData = await obtenerDatosDelUsuario(message.member)
      const newExperience = Math.floor(Math.random() * 25) + parseInt(memberLevelingData.experience, 10)
      const userLevelParsed = parseInt(memberLevelingData.level, 10)

      if (newExperience >= ((((userLevelParsed + 1) ^ 2) * message.guildConfiguration.leveling.difficulty) * 100)) {
        actualizarDatosDelUsuario(message.member, newExperience.toString(), (userLevelParsed + 1).toString()).then(() => {
          sendLevelUpMessage(message)
        })
      } else {
        actualizarDatosDelUsuario(message.member, newExperience.toString(), userLevelParsed.toString())
      }

      ClientCooldownManager.add(message.member, { name: 'leveling.obtenerExperiencia', cooldown: 60000 })
    }
  }
}

async function obtenerLeaderboard (guild: Guild) {
  try {
    const members = await PoolConnection.execute('SELECT * FROM `memberData` WHERE guild = ? ORDER BY CAST(lvlLevel AS unsigned) DESC, CAST(lvlExperience AS unsigned) DESC LIMIT 25', [guild.id]).then((result) => Object.prototype.hasOwnProperty.call(result, 'length') ? result : [])

    console.log(members)

    /*
    let memberCount = 0
    members.forEach(async (member: ) => {
      try {
        member.user = await ClientUser.users.fetch(member.member) // skipcq: JS-0040
      } catch {
        member.user = { username: 'Mysterious User', discriminator: '0000' } // skipcq: JS-0040
      } finally {
        memberCount++
      }

      if (memberCount === members.length) return members
    }) */
  } catch (err) {
    Consolex.gestionarError(err)
  }
}

registerFont('./fonts/Montserrat/Montserrat-SemiBold.ttf', {
  family: 'Montserrat'
})

async function generateRankCard (member: GuildMember): Promise<string> {
  const AttachmentBuilderPath = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.png`

  const configuracionDelModulo = await ClientGuildManager.obtenerConfiguracionDelServidorPorModulo(member.guild, 'leveling')

  obtenerDatosDelUsuario(member).then(async (memberLevelingData) => {
    const canvasWidth = 1100
    const canvasHeight = 320

    const canvasContext = createCanvas(canvasWidth, canvasHeight)
    const canvas = canvasContext.getContext('2d')

    canvas.strokeStyle = 'rgba(0,0,0,0)'

    // Establecer fondo del canvas
    if (configuracionDelModulo.card.background && isValidUrl(configuracionDelModulo.card.background) && isImageUrl(configuracionDelModulo.card.background)) {
      const background = await loadImage(configuracionDelModulo.card.background)
      const scale = Math.max(
        canvasWidth / background.width,
        canvasHeight / background.height
      )
      canvas.drawImage(
        background,
        canvasWidth / 2 - (background.width / 2) * scale,
        canvasHeight / 2 - (background.height / 2) * scale,
        background.width * scale,
        background.height * scale
      )

      canvas.fillStyle = hexToRgba(configuracionDelModulo.card.overlay.color || '#272934', configuracionDelModulo.card.overlay.opacity || 50)
      rectangulosConBordesRedondeados(canvas, { x: 16, y: 16, width: 1068, height: 290, radius: 10 })
    } else {
      canvas.fillStyle =
        configuracionDelModulo.card.overlay.color || '#272934'
      canvas.fillRect(0, 0, canvasWidth, canvasHeight)
    }

    // Escribir usuario
    canvas.font = applyText(canvasContext, member.user.tag, 40)
    canvas.textAlign = 'left'
    canvas.fillStyle = 'rgba(255, 255, 255, 0.8)'
    canvas.fillText(`${member.user.tag}`, 295, 180, 500)

    // Escribir nivel, experiencia y rango
    canvas.font = '50px "Montserrat SemiBold"'
    canvas.fillStyle = 'rgba(255, 255, 255, 0.5)'
    canvas.textAlign = 'right'
    canvas.fillText(`Rank #${memberLevelingData.rank}  Level ${millify(parseInt(memberLevelingData.level, 10))}`, 1050, 100)

    // Escribir progreso actual (actual/necesario)
    const actualVSrequired = `${millify(parseInt(memberLevelingData.experience, 10))} / ${millify(((((parseInt(memberLevelingData.level, 10) + 1) ^ 2) * configuracionDelModulo.difficulty) * 100))} XP`

    canvas.font = '30px "Montserrat SemiBold"'
    canvas.textAlign = 'right'
    canvas.fillStyle = 'rgba(255, 255, 255, 0.8)'
    canvas.fillText(actualVSrequired, 1050, 180)

    // Añadir barra de progreso (backdrop)
    canvas.fillStyle = 'rgba(255,255,255, 0.3)'
    rectangulosConBordesRedondeados(canvas, { x: 295, y: 200, width: 755, height: 70, radius: 10 })
    // Añadir barra de progreso
    canvas.fillStyle = 'rgb(255,255,255)'
    rectangulosConBordesRedondeados(canvas, { x: 295, y: 200, width: 755, height: 70, radius: 10 })

    canvas.fillStyle = 'rgb(255,255,255)'
    rectangulosConBordesRedondeados(canvas, { x: 295, y: 200, width: Math.abs(parseInt(memberLevelingData.level, 10) / ((((parseInt(memberLevelingData.level, 10) + 1) ^ 2) * configuracionDelModulo.difficulty) * 100) * 755), height: 70, radius: 10 })

    // Añadir avatar de usuario
    canvas.beginPath()
    canvas.arc(159, 159, 102, 0, Math.PI * 2, true)
    canvas.closePath()
    canvas.clip()

    const avatar = await loadImage(
      member.user.displayAvatarURL({ size: 512 })
    )
    canvas.drawImage(avatar, 57, 57, 204, 204)

    writeFileSync(AttachmentBuilderPath, canvasContext.toBuffer('image/png'))
  })

  return AttachmentBuilderPath
}

async function resetLeaderboard (guild: Guild) {
  await PoolConnection.execute('DELETE FROM memberLevelingData WHERE guild = ?', [guild.id]).catch((err) => Consolex.gestionarError(err))
}

export default new Module(
  'Leveling',
  'Leveling',
  [
    new EventHook('messageCreate', obtenerExperiencia, 'noPrefix')
  ],
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

export { resetLeaderboard, generateRankCard, obtenerLeaderboard, obtenerExperiencia }
