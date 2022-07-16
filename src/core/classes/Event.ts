class Event {
  name: string
  eventFunction: Function

  constructor (name: string, eventFunction: Function) {
    this.name = name
    this.eventFunction = eventFunction
  }

  execute (...args: Array<any>): void { // skipcq: JS-0323
    this.eventFunction(...args)
  }
}

export default Event
