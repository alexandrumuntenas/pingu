import * as fs from 'fs'
import EventHook from '../classes/EventHook'
import Consolex from './consolex'

import { ClientUser } from '../client'

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

function inyectarEnEventoFuncionesDeTerceros (funcionDeTercero: EventHook) {
  if (!funcionesDeTerceros[funcionDeTercero.evento]) funcionesDeTerceros[funcionDeTercero.evento] = { notype: [] }

  if (funcionDeTercero.tipo && !funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo]) funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo] = [funcionDeTercero.funcion]
  else if (funcionDeTercero.tipo) funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo].push(funcionDeTercero.funcion)
  else funcionesDeTerceros[funcionDeTercero.evento].notype.push(funcionDeTercero.funcion)
  Consolex.warn(`EventManager: Funciones de terceros inyectadas en evento ${funcionDeTercero.evento}`)
}

function ejecutarFuncionesDeTerceros (evento: string, tipoDeFuncion?: string | number, ...argumentos: Array<any>) {
  if (funcionesDeTerceros[evento] && funcionesDeTerceros[evento][tipoDeFuncion]) funcionesDeTerceros[evento][tipoDeFuncion].forEach(funcion => funcion(...argumentos))
  else if (funcionesDeTerceros[evento].notype) funcionesDeTerceros[evento].notype.forEach(funcion => funcion(...argumentos))
}

export { cargarEventos, cargarEventosDeProceso, inyectarEnEventoFuncionesDeTerceros, ejecutarFuncionesDeTerceros, funcionesDeTerceros }
