// Cargar traducciones de la carpeta "locales"

const { readdirSync } = require('fs')
const chalk = require('chalk')
const traduccionPrincipal = require('./locales/es.json')

const clavesAComprobar = Object.keys(traduccionPrincipal)
const clavesNoExistentes = []

readdirSync('i18n/locales').forEach(file => {
  console.warn(chalk.yellowBright(`Comprobando traducciones de ${file}`))
  const traduccion = require(`./locales/${file}`)
  clavesNoExistentes[file] = []
  clavesAComprobar.forEach(clave => {
    if (!traduccion[clave]) {
      console.info(`❌ ${file} | ${clave}`)
      clavesNoExistentes[file].push(clave)
    }
  })
})
