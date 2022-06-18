import Consolex from '../../core/consolex'
import { Guild, EmbedBuilder, Role } from 'discord.js'
import { PoolConnection } from '../../core/databaseManager'
import { PinguMessage } from '../../events/messageCreate'
import { ClientUser } from '../../client'
import reemplazarPlaceholdersConDatosReales from '../../core/utils/reemplazarPlaceholdersConDatosReales'
class CustomCommand {
  guild: Guild
  name: string
  reply: string
  properties: {
    description: string;
    usage: string;
    aliases: string[];
    category: string;
    nsfw: boolean;
    adminOnly: boolean;
    cooldown: number;
    reply: string;
    sendInEmbed: {
      title: string;
      description: string;
      thumbnail: string;
      image: string;
      url: string;
    };
    setRole: Role[]
    sendDM: boolean
    sendChannel: string
  }

  constructor (
    guild: Guild,
    name: string,
    properties: {
      description: string;
      usage: string;
      aliases: string[];
      category: string;
      nsfw: boolean;
      adminOnly: boolean;
      cooldown: number;
      reply: string;
      sendInEmbed: {
        title: string;
        description: string;
        thumbnail: string;
        image: string;
        url: string;
      };
      setRole: Role[];
      sendDM: boolean
      sendChannel: string
    }
  ) {
    this.guild = guild
    this.name = name
    this.properties = properties
  }

  async guardarComandoPersonalizado () {
    try {
      await PoolConnection.execute(
        'INSERT INTO `guildCustomCommands` (`guild`, `customcommand`, `customcommandproperties`) VALUES (?,?,?)',
        [this.guild.id, this.name, JSON.stringify(this.properties)]
      )
    } catch (err) {
      Consolex.gestionarError(err)
    }
  }

  executeCommand (message: PinguMessage) {
    const reply = { embeds: [], content: '' }

    if (this.properties.sendInEmbed) {
      const embed = new EmbedBuilder()

      if (this.properties.sendInEmbed.title) {
        embed.setTitle(this.properties.sendInEmbed.title)
      }

      if (this.properties.sendInEmbed.description) {
        reply.content = reemplazarPlaceholdersConDatosReales(
          this.reply,
          message.member
        )
        embed.setDescription(
          reemplazarPlaceholdersConDatosReales(
            this.properties.sendInEmbed.description,
            message.member
          )
        )
      } else {
        embed.setDescription(
          reemplazarPlaceholdersConDatosReales(
            this.reply,
            message.member
          )
        )
      }

      if (this.properties.sendInEmbed.thumbnail) {
        embed.setThumbnail(this.properties.sendInEmbed.thumbnail)
      }

      if (this.properties.sendInEmbed.image) {
        embed.setImage(this.properties.sendInEmbed.image)
      }

      if (this.properties.sendInEmbed.url) {
        embed.setURL(this.properties.sendInEmbed.url)
      }

      embed.setColor('#2F3136')

      embed.setFooter({
        text: `Powered by Pingu || ⚠️ This is a custom command made by ${message.guild.name}.`,
        iconURL: ClientUser.user.displayAvatarURL()
      })

      reply.embeds = [embed]
    } else {
      reply.content = reemplazarPlaceholdersConDatosReales(
        this.properties.reply,
        message.member
      )
    }

    if (this.properties.setRole) {
      this.properties.setRole.forEach(role => {
        message.member.roles.add(role)
      })
    }

    if (this.properties.sendDM) {
      try {
        reply.embeds = reply.embeds || [
          new EmbedBuilder().setDescription(
            reemplazarPlaceholdersConDatosReales(
              this.properties.reply,
              message.member
            )
          )
        ]
        message.author.send(reply)
        try {
          message.delete()
        } catch (err) {
          Consolex.gestionarError(err)
        }

        return
      } catch (err) {
        Consolex.gestionarError(err)
      }
    }

    if (this.properties.sendChannel) {
      const customChannelToSend = message.guild.channels.resolve(
        this.properties.sendChannel
      )
      if (customChannelToSend) customChannelToSend.send(reply)
      else message.reply(reply)
    } else message.reply(reply)
  }

  deleteCommand () {
    PoolConnection.execute(
      'DELETE FROM `guildCustomCommands` WHERE `guild` = ? AND `customcommand` = ?',
      [this.guild.id, this.name]
    )
  }
}

export default CustomCommand
