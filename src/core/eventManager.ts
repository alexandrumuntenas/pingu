import * as fs from 'fs'
import EventHook from './classes/EventHook.js'
import Event from './classes/Event.js'
import Consolex from './consolex.js'

import { ClientUser } from '../client.js'

class EventManager {
  eventosDisponibles: Array<Event>
  eventosDisponiblesProceso: Array<Event>
  funcionesDeTerceros: { [index: string]: { [index: string]: Array<Function> } }

  constructor () {
    this.eventosDisponibles = []
    this.eventosDisponiblesProceso = []
    this.funcionesDeTerceros = {}

    fs.readdirSync('./events/')
      .filter((files) => files.endsWith('.js'))
      .forEach((archivo) => {
        import(`../events/${archivo}`).then((evento) => {
          if (!(evento && evento.default)) {
            return
          }

          evento = evento.default

          Consolex.success(`EventManager: Evento ${archivo} cargado`)
          this.eventosDisponibles.push(evento)
          ClientUser.on(evento.name, async (...args) => evento.execute(...args)) // skipcq: JS-0376
        }).catch((error) => Consolex.gestionarError(error))
      })

    fs.readdirSync('./events/proceso')
      .filter((files) => files.endsWith('.js'))
      .forEach((archivo) => {
        import(`../events/proceso/${archivo}`).then((evento) => {
          evento = evento.default
          Consolex.success(`ProcessEventManager: Evento de proceso ${archivo} cargado`)
          this.eventosDisponiblesProceso.push(evento)
          process.on(evento.name, async (...args) => evento.execute(...args)) // skipcq: JS-0376
        }).catch((error) => Consolex.gestionarError(error))
      })
  }

  inyectarEnEventoFuncionDeTercero (funcionDeTercero: EventHook): Object {
    if (!this.funcionesDeTerceros[funcionDeTercero.evento]) {
      this.funcionesDeTerceros[funcionDeTercero.evento] = { notype: [] }
    }

    if (funcionDeTercero.tipo && !this.funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo]) {
      this.funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo] = [funcionDeTercero.funcion]
    } else if (funcionDeTercero.tipo) {
      this.funcionesDeTerceros[funcionDeTercero.evento][funcionDeTercero.tipo].push(funcionDeTercero.funcion)
    } else {
      this.funcionesDeTerceros[funcionDeTercero.evento].notype.push(funcionDeTercero.funcion)
    }
    Consolex.warn(`EventManager: Funciones de terceros inyectadas en evento ${funcionDeTercero.evento}`)

    return this.funcionesDeTerceros
  }

  ejecutarFuncionesDeTerceros (parametros: { evento: string, tipoDeFuncion?: string | number | null }, ...argumentos: any): void { // skipcq: JS-0323
    if (parametros.tipoDeFuncion && this.funcionesDeTerceros[parametros.evento] && this.funcionesDeTerceros[parametros.evento][parametros.tipoDeFuncion]) {
      return this.funcionesDeTerceros[parametros.evento][parametros.tipoDeFuncion].forEach((funcion) => funcion(...argumentos))
    } else if (this.funcionesDeTerceros[parametros.evento] && this.funcionesDeTerceros[parametros.evento].notype) {
      return this.funcionesDeTerceros[parametros.evento].notype.forEach((funcion) =>
        funcion(...argumentos)
      )
    }
  }
}

export default EventManager
