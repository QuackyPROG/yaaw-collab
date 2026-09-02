export class CommandLedger {
  #entries = new Map();

  execute(key, fingerprint, operation) {
    if (!key) {
      return operation();
    }

    const existing = this.#entries.get(key);
    if (existing) {
      if (existing.fingerprint !== fingerprint) {
        throw new Error(`idempotency key ${key} was reused for a different command`);
      }
      return existing.result;
    }

    const result = operation();
    this.#entries.set(key, { fingerprint, result });
    return result;
  }
}
