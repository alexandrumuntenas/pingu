const fs = require('fs')
const consolex = require('./consolex')

let cooldownJson = {}

if (fs.existsSync('./cooldowns.json')) cooldownJson = require('../cooldowns.json')
else {
  fs.writeFile('./cooldowns.json', '{}', err => {
    if (err) consolex.handleError(err)

    consolex.debug('CooldownManager: Cooldowns file has been created.')
    cooldownJson = require('../cooldowns.json')
  })
}

const cooldown = { ...cooldownJson }

module.exports = {}

module.exports.add = (member, guild, command) => {
  cooldown[`${command.name}${member.id}${guild.id}`] = (Date.now() + (parseInt(command.cooldown || 10000, 10)))
  setTimeout(() => { delete cooldown[`${command.name}${member.id}${guild.id}`] }, command.cooldown || 10000)
}

module.exports.check = (member, guild, commandName) => {
  if (cooldown[`${commandName}${member.id}${guild.id}`] >= Date.now()) return false

  delete cooldown[`${commandName}${member.id}${guild.id}`]
  return true
}

module.exports.ttl = (member, guild, commandName) => {
  return cooldown[`${commandName}${member.id}${guild.id}`] - Date.now()
}

module.exports.saveCooldownCollectionIntoJsonFile = () => {
  fs.writeFile('./cooldowns.json', JSON.stringify(cooldown), err => {
    if (err) throw err
    consolex.debug('CooldownManager: Cooldowns have been saved.')
  })
}

setInterval(() => { module.exports.saveCooldownCollectionIntoJsonFile() }, 60000)
