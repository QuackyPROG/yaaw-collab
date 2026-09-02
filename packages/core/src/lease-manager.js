import { randomUUID } from "node:crypto";

export class LeaseManager {
  #active = new Map();
  #fence = new Map();

  claim(resourceId, ownerId, { now = Date.now(), ttlMs = 30_000 } = {}) {
    const existing = this.#active.get(resourceId);
    if (existing && existing.expiresAt > now) {
      throw new Error(`resource ${resourceId} is already leased`);
    }

    const fencingToken = (this.#fence.get(resourceId) ?? 0) + 1;
    this.#fence.set(resourceId, fencingToken);

    const lease = Object.freeze({
      resourceId,
      ownerId,
      leaseId: randomUUID(),
      fencingToken,
      issuedAt: now,
      expiresAt: now + ttlMs
    });
    this.#active.set(resourceId, lease);
    return lease;
  }

  heartbeat(resourceId, leaseId, fencingToken, { now = Date.now(), ttlMs = 30_000 } = {}) {
    const current = this.#assertCurrent(resourceId, leaseId, fencingToken, now);
    const renewed = Object.freeze({
      ...current,
      expiresAt: now + ttlMs
    });
    this.#active.set(resourceId, renewed);
    return renewed;
  }

  assertCurrent(resourceId, leaseId, fencingToken, { now = Date.now() } = {}) {
    return this.#assertCurrent(resourceId, leaseId, fencingToken, now);
  }

  release(resourceId, leaseId, fencingToken, { now = Date.now() } = {}) {
    this.#assertCurrent(resourceId, leaseId, fencingToken, now);
    this.#active.delete(resourceId);
  }

  reapExpired({ now = Date.now() } = {}) {
    const expired = [];
    for (const [resourceId, lease] of this.#active.entries()) {
      if (lease.expiresAt <= now) {
        expired.push(lease);
        this.#active.delete(resourceId);
      }
    }
    return expired;
  }

  #assertCurrent(resourceId, leaseId, fencingToken, now) {
    const lease = this.#active.get(resourceId);
    if (!lease) {
      throw new Error(`resource ${resourceId} has no active lease`);
    }
    if (lease.expiresAt <= now) {
      throw new Error(`lease for ${resourceId} has expired`);
    }
    if (lease.leaseId !== leaseId || lease.fencingToken !== fencingToken) {
      throw new Error(`stale lease rejected for ${resourceId}`);
    }
    return lease;
  }
}
