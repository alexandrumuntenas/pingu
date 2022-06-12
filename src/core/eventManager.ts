import * as fs from 'fs'
import EventHook from './classes/EventHook'
import Event from './classes/Event'
import Consolex from './consolex'

import { ClientUser } from '../client'

class EventManager {
  eventosDisponibles: Array<Event>
  eventosDisponiblesProceso: Array<Event>
  funcionesDeTerceros: Object

  constructor () {
    fs.readdirSync('./events/')
      .filter((files) => files.endsWith('.js'))
      .forEach((archivo) => {
        const event = require(`../events/${archivo}`) // skipcq: JS-0359
        Consolex.success(`EventManager: Evento ${archivo} cargado`)
        this.eventosDisponibles.push(event)
        ClientUser.on(event.name, async (...args) => event.execute(...args)) // skipcq: JS-0376
      })

    fs.readdirSync('./events/proceso')
      .filter((files) => files.endsWith('.js'))
      .forEach((archivo) => {
        const evento = require(`../events/proceso/${archivo}`) // skipcq: JS-0359
        Consolex.success(
          `ProcessEventManager: Evento de proceso ${archivo} cargado`
        )
        this.eventosDisponiblesProceso.push(evento)
        process.on(evento.name, async (...args) => evento.execute(...args)) // skipcq: JS-0376
      })
  }

  inyectarEnEventoFuncionDeTercero (funcionDeTercero: EventHook): Object {
    if (!this.funcionesDeTerceros[funcionDeTercero.evento]) {
      this.funcionesDeTerceros[funcionDeTercero.evento] = { notype: [] }
    }

    if (
      funcionDeTercero.tipo &&
      !this.funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo]
    ) {
      this.funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo] =
        [funcionDeTercero.funcion]
    } else if (funcionDeTercero.tipo) {
      this.funcionesDeTerceros[funcionDeTercero.evento][
        funcionDeTercero.tipo
      ].push(funcionDeTercero.funcion)
    } else {
      this.funcionesDeTerceros[funcionDeTercero.evento].notype.push(
        funcionDeTercero.funcion
      )
    }
    Consolex.warn(
      `EventManager: Funciones de terceros inyectadas en evento ${funcionDeTercero.evento}`
    )

    return this.funcionesDeTerceros
  }

  ejecutarFuncionesDeTerceros (
    evento: string,
    tipoDeFuncion?: string | number,
    ...argumentos: Array<any>
  ): void {
    // skipcq: JS-0323
    if (
      this.funcionesDeTerceros[evento] &&
      this.funcionesDeTerceros[evento][tipoDeFuncion]
    ) {
      return this.funcionesDeTerceros[evento][tipoDeFuncion].forEach(
        (funcion) => funcion(...argumentos)
      )
    } else {
      return this.funcionesDeTerceros[evento].notype.forEach((funcion) =>
        funcion(...argumentos)
      )
    }
  }
}

export default EventManager
