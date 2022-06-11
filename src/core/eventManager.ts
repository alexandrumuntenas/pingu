import * as fs from 'fs'
import EventHook from '../classes/EventHook'
import Event from '../classes/Event'
import Consolex from './consolex'

import { ClientUser } from '../client'

const eventosDisponibles = []

function cargarEventos (): Array <Event> {
  fs.readdirSync('./events/').filter(files => files.endsWith('.js')).forEach(archivo => {
    const event = require(`../events/${archivo}`)
    Consolex.success(`EventManager: Evento ${archivo} cargado`)
    eventosDisponibles.push(event)
    ClientUser.on(event.name, async (...args) => event.execute(...args))
  })

  return eventosDisponibles
}

const eventosDisponiblesProceso = []

function cargarEventosDeProceso (): Array<Event> {
  fs.readdirSync('./events/proceso').filter(files => files.endsWith('.js')).forEach(archivo => {
    const evento = require(`../events/proceso/${archivo}`)
    Consolex.success(`ProcessEventManager: Evento de proceso ${archivo} cargado`)
    eventosDisponiblesProceso.push(evento)
    process.on(evento.name, async (...args) => evento.execute(...args))
  })

  return eventosDisponiblesProceso
}

const funcionesDeTerceros = {}

function inyectarEnEventoFuncionDeTercero (funcionDeTercero: EventHook): Object {
  if (!funcionesDeTerceros[funcionDeTercero.evento]) funcionesDeTerceros[funcionDeTercero.evento] = { notype: [] }

  if (funcionDeTercero.tipo && !funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo]) funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo] = [funcionDeTercero.funcion]
  else if (funcionDeTercero.tipo) funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo].push(funcionDeTercero.funcion)
  else funcionesDeTerceros[funcionDeTercero.evento].notype.push(funcionDeTercero.funcion)
  Consolex.warn(`EventManager: Funciones de terceros inyectadas en evento ${funcionDeTercero.evento}`)

  return funcionesDeTerceros
}

function ejecutarFuncionesDeTerceros (evento: string, tipoDeFuncion?: string | number, ...argumentos: Array<any>): void { // skipcq: JS-0323
  if (funcionesDeTerceros[evento] && funcionesDeTerceros[evento][tipoDeFuncion]) return funcionesDeTerceros[evento][tipoDeFuncion].forEach(funcion => funcion(...argumentos))
  else return funcionesDeTerceros[evento].notype.forEach(funcion => funcion(...argumentos))
}

export { cargarEventos, cargarEventosDeProceso, inyectarEnEventoFuncionDeTercero, ejecutarFuncionesDeTerceros, funcionesDeTerceros }
