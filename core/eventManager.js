const fs = require('fs')
const Consolex = require('./consolex')

module.exports.cargarEventos = () => {
  fs.readdirSync('./events/').filter(files => files.endsWith('.js')).forEach(archivo => {
    const event = require(`../events/${archivo}`)
    Consolex.success(`EventManager: Evento ${archivo} cargado`)
    process.Client.on(event.name, (...args) => event.execute(...args))
  })
}

module.exports.cargarEventosDeProceso = () => {
  fs.readdirSync('./events/proceso').filter(files => files.endsWith('.js')).forEach(archivo => {
    const evento = require(`../events/proceso/${archivo}`)
    Consolex.success(`ProcessEventManager: Evento de proceso ${archivo} cargado`)
    process.on(evento.name, (...args) => evento.execute(...args))
  })
}

const funcionesDeTerceros = {}

module.exports.inyectarEnEventoFuncionesDeTerceros = (evento, funcion, tipo) => {
  if (!funcionesDeTerceros[evento]) funcionesDeTerceros[evento] = { notype: [] }

  if (tipo && !funcionesDeTerceros[evento][tipo]) funcionesDeTerceros[evento][tipo] = [funcion]
  else if (tipo) funcionesDeTerceros[evento][tipo].push(funcion)
  else funcionesDeTerceros[evento].notype.push(funcion)
  Consolex.warn(`EventManager: Funciones de terceros inyectadas en evento ${evento}`)
}

module.exports.ejecutarFuncionesDeTerceros = (evento, tipoDeFuncion, ...args) => {
  if (funcionesDeTerceros[evento] && funcionesDeTerceros[evento][tipoDeFuncion]) funcionesDeTerceros[evento][tipoDeFuncion].forEach(funcion => funcion(...args))
  else if (funcionesDeTerceros[evento].notype) funcionesDeTerceros[evento].notype.forEach(funcion => funcion(...args))
}

module.exports.funcionesDeTerceros = funcionesDeTerceros
