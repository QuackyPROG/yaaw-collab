import { randomUUID } from "node:crypto";
import { CommandLedger } from "./command-ledger.js";
import { EventLog } from "./event-log.js";
import { LeaseManager } from "./lease-manager.js";
import { TaskGraph } from "./task-graph.js";
import { TaskState, assertTransition } from "./task-state.js";

function freezeTask(task) {
  return Object.freeze({
    ...task,
    acceptanceCriteria: Object.freeze([...task.acceptanceCriteria]),
    artifacts: Object.freeze(task.artifacts.map((artifact) => Object.freeze({ ...artifact }))),
    checks: Object.freeze(task.checks.map((check) => Object.freeze({ ...check }))),
    approvals: Object.freeze(task.approvals.map((approval) => Object.freeze({ ...approval })))
  });
}

export class ControlPlane {
  #tasks = new Map();
  #graph = new TaskGraph();
  #leases = new LeaseManager();
  #commands = new CommandLedger();
  #events = new EventLog();

  createTask(input, { idempotencyKey, actor = { type: "human", id: "maintainer" } } = {}) {
    const fingerprint = JSON.stringify(input);
    return this.#commands.execute(idempotencyKey, fingerprint, () => {
      const id = input.id ?? randomUUID();
      if (this.#tasks.has(id)) throw new Error(`task ${id} already exists`);
      const task = freezeTask({
        id,
        projectId: input.projectId ?? "default",
        parentTaskId: input.parentTaskId ?? null,
        title: input.title,
        objective: input.objective ?? input.title,
        acceptanceCriteria: input.acceptanceCriteria ?? [],
        approvalRequired: input.approvalRequired ?? false,
        state: TaskState.CREATED,
        artifacts: [],
        checks: [],
        approvals: [],
        ownerId: null,
        leaseId: null,
        fencingToken: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      this.#tasks.set(id, task);
      this.#graph.addTask(id);
      this.#events.append("task.created", id, actor, { title: task.title });
      return task;
    });
  }

  addDependency(taskId, dependsOnTaskId, actor = { type: "human", id: "maintainer" }) {
    this.#requireTask(taskId);
    this.#requireTask(dependsOnTaskId);
    this.#graph.addDependency(taskId, dependsOnTaskId);
    this.#events.append("task.dependency_added", taskId, actor, { dependsOnTaskId });
  }

  dependenciesOf(taskId) {
    return this.#graph.dependenciesOf(taskId);
  }

  task(taskId) {
    return this.#requireTask(taskId);
  }

  tasks() {
    return [...this.#tasks.values()];
  }

  readyCandidates() {
    const completed = new Set(
      this.tasks().filter((task) => task.state === TaskState.COMPLETE).map((task) => task.id)
    );
    return this.tasks().filter(
      (task) =>
        task.state === TaskState.CREATED &&
        this.#graph.isReady(task.id, completed)
    );
  }

  markReady(taskId, actor = { type: "system", id: "scheduler" }) {
    const task = this.#requireTask(taskId);
    const completed = new Set(
      this.tasks().filter((item) => item.state === TaskState.COMPLETE).map((item) => item.id)
    );
    if (!this.#graph.isReady(taskId, completed)) {
      throw new Error(`task ${taskId} has incomplete dependencies`);
    }
    return this.#transition(taskId, TaskState.READY, actor);
  }

  claim(taskId, ownerId, { now = Date.now(), ttlMs = 30_000 } = {}) {
    const task = this.#requireTask(taskId);
    if (task.state !== TaskState.READY) {
      throw new Error(`task ${taskId} must be ready before claim`);
    }
    const lease = this.#leases.claim(taskId, ownerId, { now, ttlMs });
    const next = this.#replace(taskId, {
      state: TaskState.CLAIMED,
      ownerId,
      leaseId: lease.leaseId,
      fencingToken: lease.fencingToken,
      updatedAt: now
    });
    this.#events.append("task.claimed", taskId, { type: "worker", id: ownerId }, {
      fencingToken: lease.fencingToken,
      expiresAt: lease.expiresAt
    }, now);
    return { task: next, lease };
  }

  start(taskId, ownerId, lease, { now = Date.now() } = {}) {
    this.#assertLease(taskId, lease, now);
    return this.#transition(taskId, TaskState.RUNNING, { type: "worker", id: ownerId }, now);
  }

  heartbeat(taskId, lease, { now = Date.now(), ttlMs = 30_000 } = {}) {
    const renewed = this.#leases.heartbeat(
      taskId,
      lease.leaseId,
      lease.fencingToken,
      { now, ttlMs }
    );
    this.#events.append("task.heartbeat", taskId, { type: "worker", id: lease.ownerId }, {
      fencingToken: renewed.fencingToken,
      expiresAt: renewed.expiresAt
    }, now);
    return renewed;
  }

  submitArtifact(taskId, ownerId, lease, artifact, { now = Date.now() } = {}) {
    this.#assertLease(taskId, lease, now);
    const task = this.#requireTask(taskId);
    if (task.state !== TaskState.RUNNING) {
      throw new Error("artifacts may be submitted only while task is running");
    }
    const next = this.#replace(taskId, {
      artifacts: [...task.artifacts, { ...artifact, recordedAt: now }],
      updatedAt: now
    });
    this.#events.append("task.artifact_recorded", taskId, { type: "worker", id: ownerId }, {
      kind: artifact.kind,
      ref: artifact.ref
    }, now);
    return next;
  }

  beginVerification(taskId, ownerId, lease, { now = Date.now() } = {}) {
    this.#assertLease(taskId, lease, now);
    const task = this.#requireTask(taskId);
    if (task.artifacts.length === 0) {
      throw new Error("verification requires at least one recorded artifact");
    }
    return this.#transition(taskId, TaskState.VERIFYING, { type: "worker", id: ownerId }, now);
  }

  recordCheck(taskId, check, actor = { type: "system", id: "verification" }, at = Date.now()) {
    const task = this.#requireTask(taskId);
    if (![TaskState.VERIFYING, TaskState.APPROVAL].includes(task.state)) {
      throw new Error("checks may be recorded only during verification or approval");
    }
    const next = this.#replace(taskId, {
      checks: [...task.checks, { ...check, recordedAt: at }],
      updatedAt: at
    });
    this.#events.append("task.check_recorded", taskId, actor, {
      name: check.name,
      passed: Boolean(check.passed)
    }, at);
    return next;
  }

  requestApproval(taskId, actor = { type: "system", id: "verification" }, at = Date.now()) {
    const task = this.#requireTask(taskId);
    this.#assertChecksPassed(task);
    if (!task.approvalRequired) {
      throw new Error("task does not require approval");
    }
    return this.#transition(taskId, TaskState.APPROVAL, actor, at);
  }

  approve(taskId, approverId, at = Date.now()) {
    const task = this.#requireTask(taskId);
    if (task.state !== TaskState.APPROVAL) {
      throw new Error("task is not awaiting approval");
    }
    const next = this.#replace(taskId, {
      approvals: [...task.approvals, { approverId, at }],
      updatedAt: at
    });
    this.#events.append("task.approved", taskId, { type: "human", id: approverId }, {}, at);
    return next;
  }

  complete(taskId, actor = { type: "system", id: "verification" }, at = Date.now()) {
    const task = this.#requireTask(taskId);
    if (task.artifacts.length === 0) {
      throw new Error("task cannot complete without artifacts");
    }
    this.#assertChecksPassed(task);

    if (task.approvalRequired) {
      if (task.state !== TaskState.APPROVAL || task.approvals.length === 0) {
        throw new Error("task requires human approval before completion");
      }
    } else if (task.state !== TaskState.VERIFYING) {
      throw new Error("task must be verifying before completion");
    }

    const next = this.#transition(taskId, TaskState.COMPLETE, actor, at);
    const current = this.#tasks.get(taskId);
    if (current?.leaseId && current?.fencingToken) {
      try {
        this.#leases.release(taskId, current.leaseId, current.fencingToken, { now: at });
      } catch {
        // Completion evidence remains authoritative even if a lease expired between checks.
      }
    }
    return next;
  }

  recoverExpiredLeases({ now = Date.now() } = {}) {
    const expired = this.#leases.reapExpired({ now });
    const recovered = [];

    for (const lease of expired) {
      const task = this.#tasks.get(lease.resourceId);
      if (!task || ![TaskState.CLAIMED, TaskState.RUNNING].includes(task.state)) continue;
      const next = this.#replace(task.id, {
        state: TaskState.READY,
        ownerId: null,
        leaseId: null,
        fencingToken: null,
        updatedAt: now
      });
      this.#events.append("task.lease_expired", task.id, { type: "system", id: "reconciler" }, {
        previousOwnerId: lease.ownerId,
        previousFencingToken: lease.fencingToken
      }, now);
      recovered.push(next);
    }

    return recovered;
  }

  events(taskId) {
    return this.#events.forAggregate(taskId);
  }

  #assertChecksPassed(task) {
    if (task.checks.length === 0) {
      throw new Error("task cannot complete without verification checks");
    }
    const failed = task.checks.find((check) => !check.passed);
    if (failed) {
      throw new Error(`verification check failed: ${failed.name}`);
    }
  }

  #assertLease(taskId, lease, now) {
    return this.#leases.assertCurrent(
      taskId,
      lease.leaseId,
      lease.fencingToken,
      { now }
    );
  }

  #transition(taskId, to, actor, at = Date.now()) {
    const task = this.#requireTask(taskId);
    assertTransition(task.state, to);
    const next = this.#replace(taskId, { state: to, updatedAt: at });
    this.#events.append("task.transitioned", taskId, actor, { from: task.state, to }, at);
    return next;
  }

  #replace(taskId, patch) {
    const current = this.#requireTask(taskId);
    const next = freezeTask({ ...current, ...patch });
    this.#tasks.set(taskId, next);
    return next;
  }

  #requireTask(taskId) {
    const task = this.#tasks.get(taskId);
    if (!task) throw new Error(`unknown task ${taskId}`);
    return task;
  }
}
