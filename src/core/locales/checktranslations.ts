// Cargar traducciones de la carpeta "guild.preferredLocales" 
 
const { readdirSync } = require('fs') 
const chalk = require('chalk') 
const traduccionPrincipal = require('./guild.preferredLocales/es.json') 
 
const clavesAComprobar = Object.keys(traduccionPrincipal) 
const clavesNoExistentes = [] 
 
readdirSync('i18n/guild.preferredLocales').forEach(file => { 
   // skipqc: JS-0002 
  const traduccion = require(`./guild.preferredLocales/${file}`) 
  clavesNoExistentes[file] = [] 
  clavesAComprobar.forEach(clave => { 
    if (!traduccion[clave]) { 
       // skipqc: JS-0002 
      clavesNoExistentes[file].push(clave) 
    } 
  }) 
}) 
