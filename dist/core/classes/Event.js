class Event {
    name;
    eventFunction;
    constructor(name, eventFunction) {
        this.name = name;
        this.eventFunction = eventFunction;
    }
    execute(...args) {
        this.eventFunction(...args);
    }
}
export default Event;
