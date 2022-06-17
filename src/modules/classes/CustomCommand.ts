import { Message } from 'discord.js'

class CustomCommand {
  name: string
  description: string
  usage: string
  aliases: string[]
  category: string
  nsfw: boolean
  adminOnly: boolean
  cooldown: number
  execute: Function

  constructor (name: string, description: string, usage: string, aliases: string[], category: string, nsfw: boolean, adminOnly: boolean, cooldown: number, execute: Function) {
    this.name = name
    this.description = description
    this.usage = usage
    this.aliases = aliases
    this.category = category
    this.nsfw = nsfw
    this.adminOnly = adminOnly
    this.cooldown = cooldown
    this.execute = execute
  }

  executeCommand (message: Message, args: string[]) {

  }
}

export default CustomCommand
