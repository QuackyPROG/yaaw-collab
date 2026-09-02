export const TaskState = Object.freeze({
  CREATED: "created",
  READY: "ready",
  CLAIMED: "claimed",
  RUNNING: "running",
  BLOCKED: "blocked",
  VERIFYING: "verifying",
  APPROVAL: "approval",
  COMPLETE: "complete",
  CANCELLED: "cancelled",
  SUPERSEDED: "superseded",
  EXPIRED: "expired",
  FAILED_PERMANENTLY: "failed_permanently",
  QUARANTINED: "quarantined",
  REVALIDATION_REQUIRED: "revalidation_required",
  NEEDS_RECONCILIATION: "needs_reconciliation"
});

const terminal = new Set([
  TaskState.COMPLETE,
  TaskState.CANCELLED,
  TaskState.SUPERSEDED,
  TaskState.EXPIRED,
  TaskState.FAILED_PERMANENTLY
]);

const transitions = new Map([
  [TaskState.CREATED, new Set([TaskState.READY, TaskState.CANCELLED, TaskState.SUPERSEDED])],
  [TaskState.READY, new Set([TaskState.CLAIMED, TaskState.CANCELLED, TaskState.SUPERSEDED, TaskState.EXPIRED])],
  [TaskState.CLAIMED, new Set([TaskState.RUNNING, TaskState.READY, TaskState.CANCELLED, TaskState.EXPIRED])],
  [TaskState.RUNNING, new Set([
    TaskState.BLOCKED,
    TaskState.VERIFYING,
    TaskState.READY,
    TaskState.CANCELLED,
    TaskState.QUARANTINED,
    TaskState.NEEDS_RECONCILIATION
  ])],
  [TaskState.BLOCKED, new Set([TaskState.READY, TaskState.RUNNING, TaskState.CANCELLED, TaskState.SUPERSEDED])],
  [TaskState.VERIFYING, new Set([
    TaskState.APPROVAL,
    TaskState.COMPLETE,
    TaskState.RUNNING,
    TaskState.FAILED_PERMANENTLY,
    TaskState.REVALIDATION_REQUIRED
  ])],
  [TaskState.APPROVAL, new Set([TaskState.COMPLETE, TaskState.RUNNING, TaskState.CANCELLED])],
  [TaskState.REVALIDATION_REQUIRED, new Set([TaskState.READY, TaskState.RUNNING, TaskState.CANCELLED])],
  [TaskState.NEEDS_RECONCILIATION, new Set([TaskState.READY, TaskState.RUNNING, TaskState.CANCELLED])],
  [TaskState.QUARANTINED, new Set([TaskState.READY, TaskState.CANCELLED, TaskState.FAILED_PERMANENTLY])]
]);

export function isTerminalState(state) {
  return terminal.has(state);
}

export function canTransition(from, to) {
  return transitions.get(from)?.has(to) ?? false;
}

export function assertTransition(from, to) {
  if (from === to) {
    throw new Error(`task is already in state ${to}`);
  }
  if (isTerminalState(from)) {
    throw new Error(`terminal task state ${from} cannot transition`);
  }
  if (!canTransition(from, to)) {
    throw new Error(`invalid task transition: ${from} -> ${to}`);
  }
}
