import test from "node:test";
import assert from "node:assert/strict";
import { ControlPlane, TaskState } from "../src/index.js";

test("task cannot complete without artifact and verification", () => {
  const plane = new ControlPlane();
  plane.createTask({ id: "T1", title: "Implement endpoint" });
  plane.markReady("T1");
  const { lease } = plane.claim("T1", "worker");
  plane.start("T1", "worker", lease);

  assert.throws(() => plane.beginVerification("T1", "worker", lease), /artifact/);
});

test("approval-required task needs human approval", () => {
  const plane = new ControlPlane();
  plane.createTask({ id: "T2", title: "Deploy migration", approvalRequired: true });
  plane.markReady("T2");
  const { lease } = plane.claim("T2", "worker");
  plane.start("T2", "worker", lease);
  plane.submitArtifact("T2", "worker", lease, { kind: "commit", ref: "abc123" });
  plane.beginVerification("T2", "worker", lease);
  plane.recordCheck("T2", { name: "migration-test", passed: true });
  plane.requestApproval("T2");

  assert.throws(() => plane.complete("T2"), /human approval/);
  plane.approve("T2", "QuackyPROG");
  const completed = plane.complete("T2");
  assert.equal(completed.state, TaskState.COMPLETE);
});

test("expired task is recovered and stale worker loses authority", () => {
  const plane = new ControlPlane();
  plane.createTask({ id: "T3", title: "Fix session bug" });
  plane.markReady("T3");
  const first = plane.claim("T3", "worker-a", { now: 10, ttlMs: 10 });
  plane.start("T3", "worker-a", first.lease, { now: 11 });

  const recovered = plane.recoverExpiredLeases({ now: 21 });
  assert.equal(recovered[0].state, TaskState.READY);

  const second = plane.claim("T3", "worker-b", { now: 21, ttlMs: 10 });
  plane.start("T3", "worker-b", second.lease, { now: 22 });

  assert.throws(
    () =>
      plane.submitArtifact(
        "T3",
        "worker-a",
        first.lease,
        { kind: "commit", ref: "stale" },
        { now: 22 }
      ),
    /stale lease/
  );
});

test("dependencies prevent premature readiness", () => {
  const plane = new ControlPlane();
  plane.createTask({ id: "A", title: "Define contract" });
  plane.createTask({ id: "B", title: "Implement backend" });
  plane.addDependency("B", "A");
  assert.throws(() => plane.markReady("B"), /incomplete dependencies/);
});

test("task creation is idempotent for the same command key", () => {
  const plane = new ControlPlane();
  const input = { id: "T4", title: "Idempotent task" };
  const first = plane.createTask(input, { idempotencyKey: "create-T4" });
  const second = plane.createTask(input, { idempotencyKey: "create-T4" });

  assert.deepEqual(second, first);
  assert.equal(plane.tasks().length, 1);
  assert.equal(plane.events("T4").filter((event) => event.type === "task.created").length, 1);
});

test("failed deterministic verification prevents completion", () => {
  const plane = new ControlPlane();
  plane.createTask({ id: "T5", title: "Risky change" });
  plane.markReady("T5");
  const { lease } = plane.claim("T5", "worker");
  plane.start("T5", "worker", lease);
  plane.submitArtifact("T5", "worker", lease, { kind: "commit", ref: "bad123" });
  plane.beginVerification("T5", "worker", lease);
  plane.recordCheck("T5", { name: "integration", passed: false });

  assert.throws(() => plane.complete("T5"), /verification check failed/);
});
