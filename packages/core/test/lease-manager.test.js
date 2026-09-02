import test from "node:test";
import assert from "node:assert/strict";
import { LeaseManager } from "../src/lease-manager.js";

test("expired worker is fenced after another worker reclaims", () => {
  const leases = new LeaseManager();
  const first = leases.claim("TASK-1", "worker-a", { now: 1_000, ttlMs: 100 });
  leases.reapExpired({ now: 1_101 });
  const second = leases.claim("TASK-1", "worker-b", { now: 1_101, ttlMs: 100 });

  assert.equal(second.fencingToken, first.fencingToken + 1);
  assert.throws(
    () => leases.assertCurrent("TASK-1", first.leaseId, first.fencingToken, { now: 1_102 }),
    /stale lease/
  );
  assert.doesNotThrow(
    () => leases.assertCurrent("TASK-1", second.leaseId, second.fencingToken, { now: 1_102 })
  );
});
