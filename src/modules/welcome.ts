import { Attachment, GuildMember } from 'discord.js'
import { ClientGuildManager } from '../client'
import { registerFont, createCanvas, loadImage } from 'canvas'
import { writeFileSync } from 'fs'

import EventHook from '../classes/EventHook'
import Module from '../core/classes/Module'
import reemplazarPlaceholdersConDatosReales from '../core/utils/reemplazarPlaceholdersConDatosReales'
import rectangulosConBordesRedondeados from './utils/canvas/rectangulosConBordesRedondeados'
import applyText from './utils/canvas/applyText'

import * as randomstring from 'randomstring'
import * as isValidUrl from 'is-valid-http-url'
import * as isImageUrl from 'is-image-url'
import * as hexToRgba from 'hex-rgba'
import { ChannelType } from 'discord-api-types/v10'

function giveMemberRoles (member: GuildMember) {
  ClientGuildManager.obtenerConfiguracionDelServidorPorModulo(member.guild, 'welcome').then((configuracionDelModulo) => {
    if (configuracionDelModulo.enabled && configuracionDelModulo.roles && Array.isArray(configuracionDelModulo.roles)) {
      configuracionDelModulo.roles.forEach((role: string) => {
        const roleToGive = member.guild.roles.cache.get(role)
        if (roleToGive) member.roles.add(roleToGive)
      })
    }
  })
}

function sendWelcomeMessage (member: GuildMember) {
  ClientGuildManager.obtenerConfiguracionDelServidorPorModulo(member.guild, 'welcome').then((configuracionDelModulo) => {
    if (configuracionDelModulo.enabled && configuracionDelModulo.channel) {
      const canalDondeSeEnviaElMensaje = member.guild.channels.cache.get(configuracionDelModulo.channel)

      if (canalDondeSeEnviaElMensaje && canalDondeSeEnviaElMensaje?.type === ChannelType.GuildText) {
        const message: { content: string, files: Attachment[] } = { content: reemplazarPlaceholdersConDatosReales(configuracionDelModulo.message || '{member} joined {server}!', member), files: [] }

        if (configuracionDelModulo.card && Object.prototype.hasOwnProperty.call(configuracionDelModulo.card, 'enabled') && configuracionDelModulo.card.enabled) {
          generateWelcomeCard(member).then((path) => {
            message.files.push(new Attachment(path))
          })
        }

        canalDondeSeEnviaElMensaje?.send(message)
      }
    }
  })
}

registerFont('./fonts/Montserrat/Montserrat-SemiBold.ttf', {
  family: 'Montserrat'
})

async function generateWelcomeCard (member: GuildMember) {
  ClientGuildManager.obtenerConfiguracionDelServidorPorModulo(member.guild, 'welcome').then(async (configuracionDelModulo) => {
    const attachmentPath = `./temp/${randomstring.generate({ charset: 'alphabetic' })}.png`

    const canvasWidth = 1100
    const canvasHeight = 500

    const canvasContext = createCanvas(canvasWidth, canvasHeight)
    const canvas = canvasContext.getContext('2d')

    canvas.strokeStyle = 'rgba(0,0,0,0)'

    if (configuracionDelModulo.welcomecard.background && isValidUrl(configuracionDelModulo.welcomecard.background) && isImageUrl(configuracionDelModulo.welcomecard.background)) {
      const background = await loadImage(configuracionDelModulo.welcomecard.background)
      const scale = Math.max(
        canvasContext.width / background.width,
        canvasContext.height / background.height
      )
      canvas.drawImage(
        background,
        (canvasContext.width / 2) - ((background.width / 2) * scale),
        (canvasContext.height / 2) - ((background.height / 2) * scale),
        background.width * scale,
        background.height * scale
      )
      canvas.fillStyle = hexToRgba(
        configuracionDelModulo.welcomecard.overlay.color || '#272934',
        configuracionDelModulo.welcomecard.overlay.opacity || 50
      )
      rectangulosConBordesRedondeados(canvas, { x: 25, y: 25, width: 1050, height: 450, radius: 10, fill: canvas.fillStyle })
    } else {
      canvas.fillStyle = configuracionDelModulo.welcomecard.overlay.color || '#272934'
      canvas.fillRect(0, 0, canvasContext.width, canvasContext.height)
    }

    const title = reemplazarPlaceholdersConDatosReales(configuracionDelModulo.welcomecard.title || '{user.tag} just joined the server', member)
    const subtitle = reemplazarPlaceholdersConDatosReales(configuracionDelModulo.welcomecard.subtitle || 'Member #{guild.member_count}', member)

    canvas.font = applyText(canvasContext, title)
    canvas.fillStyle = '#ffffff'
    canvas.textAlign = 'center'
    canvas.fillText(title, canvasContext.width / 2, 387)

    canvas.font = applyText(canvasContext, subtitle, 30)
    canvas.fillStyle = 'rgba(255, 255, 255, 0.8)'
    canvas.fillText(subtitle, canvasContext.width / 2, 437)

    // Añadir avatar de usuario
    canvas.beginPath()
    canvas.arc(canvasContext.width / 2, 175, 125, 0, Math.PI * 2, true)
    canvas.closePath()
    canvas.strokeStyle = 'white'
    canvas.lineWidth = 10
    canvas.stroke()
    canvas.beginPath()
    canvas.arc(canvasContext.width / 2, 175, 100, 0, Math.PI * 2, true)
    canvas.closePath()
    canvas.clip()

    const avatar = await loadImage(member.user.displayAvatarURL({ size: 512 }))
    canvas.drawImage(avatar, (canvasContext.width / 2) - 100, 75, 200, 200)

    const buffer = canvasContext.toBuffer('image/png')
    writeFileSync(attachmentPath, buffer)

    return attachmentPath
  })
}

function doGuildMemberAdd (member: GuildMember) {
  ClientGuildManager.obtenerConfiguracionDelServidorPorModulo(member.guild, 'welcome').then(configuracionDelModulo => {
    if (configuracionDelModulo.enabled) {
      giveMemberRoles(member)
      sendWelcomeMessage(member)
    }
  })
}

export default new Module(
  'Welcome',
  'Funciones ejecutadas en messageCreate',
  [
    new EventHook('guildMemberAdd', doGuildMemberAdd)
  ],
  {
    enabled: 'boolean',
    channel: 'string',
    message: 'string',
    welcomecard: {
      enabled: 'boolean',
      background: 'string',
      title: 'string',
      subtitle: 'string',
      overlay: {
        color: 'string',
        opacity: 'number'
      }
    },
    roles: 'array'
  },
  {
    enabled: false,
    channel: '000000000',
    message: 'Hey {user}, welcome to **{server}**!',
    welcomecard: { enabled: true, background: 'https://raw.githubusercontent.com/alexandrumuntenas/pingu/main/setup/defaultresourcesforguilds/backgroundforwelcomecard.jpg', title: '{user.tag} just joined the server', subtitle: 'Member #{server.member_count}', overlay: { color: '#044860', opacity: 50 } },
    roles: []
  }
)
