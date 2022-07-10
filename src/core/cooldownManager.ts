import { GuildMember } from 'discord.js'
import { existsSync, writeFile } from 'fs'
import Command from './classes/Command'
import Consolex from './consolex'

let JSONCooldown = {}

try {
  if (existsSync('./cooldowns.json')) {
    try {
      JSONCooldown = require('../cooldowns.json')
    } catch (error: any) {
      if (error.code === 'SyntaxError') {
        Consolex.debug('CooldownManager: Cooldowns file is corrupted. Creating new one.')

        writeFile('./cooldowns.json', JSON.stringify({}), (err) => {
          if (err) Consolex.gestionarError(err)
          Consolex.debug('CooldownManager: Cooldowns file created.')
        })
        JSONCooldown = {}
      }
    }
  } else {
    writeFile('./cooldowns.json', '{}', (err) => {
      if (err) Consolex.gestionarError(err)

      Consolex.debug('CooldownManager: Cooldowns file has been created.')
      JSONCooldown = require('../cooldowns.json')
    })
  }
} catch (err) {
  Consolex.gestionarError(err)
}

const cooldown = { ...JSONCooldown }

class CooldownManager {
  cooldown: {
    [key: string]: number
  }

  constructor () {
    this.cooldown = cooldown
    setInterval(() => {
      this.saveCooldownCollectionIntoJsonFile()
    }, 60000)
  }

  add (member: GuildMember | null, command: Command | { name: string, cooldown?: number }): void {
    if (!(member instanceof GuildMember)) throw new Error('El "GuildMember" especificado no existe.')
    this.cooldown[`${command.name}${member.id}${member.guild.id}`] =
      Date.now() + (command.cooldown || 10000)
    setTimeout(() => {
      delete this.cooldown[`${command.name}${member.id}${member.guild.id}`]
    }, command.cooldown || 10000)
  }

  check (member: GuildMember | null, command: Command | { name: string }): boolean {
    if (!(member instanceof GuildMember)) throw new Error('El "GuildMember" especificado no existe.')
    if (this.cooldown[`${command.name}${member.id}${member.guild.id}`] >= Date.now()) { return false }

    delete this.cooldown[`${command.name}${member.id}${member.guild.id}`]
    return true
  }

  ttl (member: GuildMember | null, command: Command | { name: string }): number {
    if (!(member instanceof GuildMember)) throw new Error('El "GuildMember" especificado no existe.')
    return this.cooldown[`${command.name}${member.id}${member.guild.id}`] - Date.now()
  }

  saveCooldownCollectionIntoJsonFile (): void {
    writeFile('./cooldowns.json', JSON.stringify(cooldown), (err) => {
      if (err) Consolex.gestionarError(err)
      Consolex.debug('CooldownManager: Cooldowns have been saved.')
    })
  }
}

export default CooldownManager
