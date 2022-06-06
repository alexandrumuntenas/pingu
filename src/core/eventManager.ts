import * as fs from 'fs'
import { ClientUser } from '../client'
import Consolex from './consolex'

function cargarEventos () {
  fs.readdirSync('./events/').filter(files => files.endsWith('.js')).forEach(archivo => {
    const event = require(`../events/${archivo}`)
    Consolex.success(`EventManager: Evento ${archivo} cargado`)
    ClientUser.on(event.name, async (...args) => event.execute(...args))
  })
}

function cargarEventosDeProceso () {
  fs.readdirSync('./events/proceso').filter(files => files.endsWith('.js')).forEach(archivo => {
    const evento = require(`../events/proceso/${archivo}`)
    Consolex.success(`ProcessEventManager: Evento de proceso ${archivo} cargado`)
    process.on(evento.name, async (...args) => evento.execute(...args))
  })
}

const funcionesDeTerceros = {}

function inyectarEnEventoFuncionesDeTerceros (evento: string, funcion: Function, tipo: string | number) {
  if (!funcionesDeTerceros[evento]) funcionesDeTerceros[evento] = { notype: [] }

  if (tipo && !funcionesDeTerceros[evento][tipo]) funcionesDeTerceros[evento][tipo] = [funcion]
  else if (tipo) funcionesDeTerceros[evento][tipo].push(funcion)
  else funcionesDeTerceros[evento].notype.push(funcion)
  Consolex.warn(`EventManager: Funciones de terceros inyectadas en evento ${evento}`)
}

function ejecutarFuncionesDeTerceros (evento: string, tipoDeFuncion?: string | number, ...argumentos: Array<any>) {
  if (funcionesDeTerceros[evento] && funcionesDeTerceros[evento][tipoDeFuncion]) funcionesDeTerceros[evento][tipoDeFuncion].forEach(funcion => funcion(...argumentos))
  else if (funcionesDeTerceros[evento].notype) funcionesDeTerceros[evento].notype.forEach(funcion => funcion(...argumentos))
}

export { cargarEventos, cargarEventosDeProceso, inyectarEnEventoFuncionesDeTerceros, ejecutarFuncionesDeTerceros, funcionesDeTerceros }
