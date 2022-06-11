import { codeBlock, EmbedBuilder } from '@discordjs/builders'
import { Colors } from 'discord.js'
import { ClientUser } from '../client'

class messages {
  messageTemplateSettings: {
    [key: string]: {
      color: number,
      emoji: string
    }
  }

  constructor () {
    this.messageTemplateSettings = {
      status: {
        color: Colors.Blurple,
        emoji: '📝'
      },
      success: {
        color: Colors.Green,
        emoji: '✅'
      },
      error: {
        color: Colors.Red,
        emoji: '❌'
      },
      warning: {
        color: Colors.Orange,
        emoji: '⚠'
      },
      info: {
        color: Colors.Blue,
        emoji: 'ℹ'
      },
      debug: {
        color: Colors.LuminousVividPink,
        emoji: '🔧'
      },
      question: {
        color: Colors.Gold,
        emoji: '❓'
      },
      loading: {
        color: Colors.Blurple,
        emoji: '<a:core_loading:970712845429903461>'
      },
      help: {
        color: Colors.Gold,
        emoji: '❓'
      }
    }
  }

  status (message: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.messageTemplateSettings.status.color)
      .setDescription(`${this.messageTemplateSettings.status.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()
  }

  success (message: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.messageTemplateSettings.success.color)
      .setDescription(`${this.messageTemplateSettings.success.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()
  }

  error (message: string, debugLog?: string): EmbedBuilder {
    const errorEmbed = new EmbedBuilder()
      .setColor(this.messageTemplateSettings.error.color)
      .setDescription(`${this.messageTemplateSettings.error.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()

    debugLog ? errorEmbed.addFields({ name: 'Debug', value: codeBlock(debugLog) }) : errorEmbed.addFields()

    return errorEmbed
  }

  warning (message: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.messageTemplateSettings.warning.color)
      .setDescription(`${this.messageTemplateSettings.warning.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()
  }

  info (message: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.messageTemplateSettings.info.color)
      .setDescription(`${this.messageTemplateSettings.info.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()
  }

  debug (message: string, debugLog?: string): EmbedBuilder {
    const debugEmbed = new EmbedBuilder()
      .setColor(this.messageTemplateSettings.error.color)
      .setDescription(`${this.messageTemplateSettings.error.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()

    debugLog ? debugEmbed.addFields({ name: 'Debug', value: codeBlock(debugLog) }) : debugEmbed.addFields()

    return debugEmbed
  }

  question (message: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.messageTemplateSettings.question.color)
      .setDescription(`${this.messageTemplateSettings.question.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()
  }

  loading (message: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.messageTemplateSettings.loading.color)
      .setDescription(`${this.messageTemplateSettings.loading.emoji} ${message}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()
  }

  help (command: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(this.messageTemplateSettings.help.color)
      .setDescription(`${this.messageTemplateSettings.help.emoji} https://alexandrumuntenas.dev/pingu/commandReference#${command}`)
      .setFooter({ text: 'Powered by Pingu', iconURL: ClientUser.user.displayAvatarURL() })
      .setTimestamp()
  }
}

export default messages
