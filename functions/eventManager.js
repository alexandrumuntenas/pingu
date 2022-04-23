const fs = require('fs')
const Consolex = require('./consolex')

module.exports.cargarEventos = () => {
  for (const file of fs.readdirSync('./events').filter(files => files.endsWith('.js'))) {
    const event = require(`../events/${file}`)
    Consolex.success(`Evento ${file} cargado`)
    process.Client.on(event.name, (...args) => event.execute(...args))
  }
}

const funcionesDeTerceros = {}

module.exports.inyectarEnEventoFuncionesDeTerceros = (evento, funcion) => {
  if (!funcionesDeTerceros[evento]) funcionesDeTerceros[evento] = [].push(funcion)
  else funcionesDeTerceros[evento].push(funcion)
}

module.exports.ejecutarFuncionesDeTerceros = (evento, ...args) => {
  if (funcionesDeTerceros[evento]) funcionesDeTerceros[evento].forEach(funcion => funcion(...args))
}

module.exports.funcionesDeTerceros = funcionesDeTerceros
