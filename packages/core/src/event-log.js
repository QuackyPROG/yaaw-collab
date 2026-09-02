export class EventLog {
  #events = [];
  #nextSequence = 1;

  append(type, aggregateId, actor, payload = {}, at = Date.now()) {
    const event = Object.freeze({
      sequence: this.#nextSequence++,
      type,
      aggregateId,
      actor: Object.freeze({ ...actor }),
      payload: Object.freeze({ ...payload }),
      at
    });
    this.#events.push(event);
    return event;
  }

  forAggregate(aggregateId) {
    return this.#events.filter((event) => event.aggregateId === aggregateId);
  }

  all() {
    return [...this.#events];
  }
}
