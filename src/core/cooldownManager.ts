import { Guild, GuildMember } from 'discord.js'
import { existsSync, writeFile } from 'fs'
import Command from './classes/Command'
import Consolex from './consolex'

let JSONCooldown = {}

try {
  if (existsSync('./cooldowns.json')) {
    try {
      JSONCooldown = require('../cooldowns.json')
    } catch (error) {
      if (error.code === 'SyntaxError') {
        Consolex.debug(
          'CooldownManager: Cooldowns file is corrupted. Creating new one.'
        )

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

  add (member: GuildMember, guild: Guild, command: Command | { name: string, cooldown: number }): void {
    this.cooldown[`${command.name}${member.id}${guild.id}`] =
      Date.now() + (command.cooldown || 10000)
    setTimeout(() => {
      delete this.cooldown[`${command.name}${member.id}${guild.id}`]
    }, command.cooldown || 10000)
  }

  check (member: GuildMember, guild: Guild, command: Command | { name: string }): boolean {
    if (this.cooldown[`${command.name}${member.id}${guild.id}`] >= Date.now()) { return false }

    delete this.cooldown[`${command.name}${member.id}${guild.id}`]
    return true
  }

  ttl (member: GuildMember, guild: Guild, command: Command | { name: string }): number {
    return this.cooldown[`${command.name}${member.id}${guild.id}`] - Date.now()
  }

  saveCooldownCollectionIntoJsonFile (): void {
    writeFile('./cooldowns.json', JSON.stringify(cooldown), (err) => {
      if (err) Consolex.gestionarError(err)
      Consolex.debug('CooldownManager: Cooldowns have been saved.')
    })
  }
}

export default CooldownManager
