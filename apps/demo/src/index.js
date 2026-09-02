import { ControlPlane, TaskState } from "../../../packages/core/src/index.js";

const plane = new ControlPlane();
const maintainer = { type: "human", id: "QuackyPROG" };

function create(id, title, options = {}) {
  return plane.createTask(
    {
      id,
      projectId: "passwordless-login",
      title,
      objective: title,
      acceptanceCriteria: options.acceptanceCriteria ?? [],
      approvalRequired: options.approvalRequired ?? false
    },
    { actor: maintainer, idempotencyKey: `create:${id}` }
  );
}

function finish(taskId, workerId, artifactRef, options = {}) {
  plane.markReady(taskId);
  const { lease } = plane.claim(taskId, workerId, { now: options.now ?? Date.now(), ttlMs: options.ttlMs ?? 30_000 });
  plane.start(taskId, workerId, lease, { now: (options.now ?? Date.now()) + 1 });
  plane.submitArtifact(
    taskId,
    workerId,
    lease,
    { kind: "report", ref: artifactRef },
    { now: (options.now ?? Date.now()) + 2 }
  );
  plane.beginVerification(taskId, workerId, lease, { now: (options.now ?? Date.now()) + 3 });
  plane.recordCheck(taskId, { name: "acceptance-check", passed: true }, { type: "system", id: "verification" }, (options.now ?? Date.now()) + 4);
  if (plane.task(taskId).approvalRequired) {
    plane.requestApproval(taskId, { type: "system", id: "verification" }, (options.now ?? Date.now()) + 5);
    plane.approve(taskId, "QuackyPROG", (options.now ?? Date.now()) + 6);
  }
  plane.complete(taskId, { type: "system", id: "verification" }, (options.now ?? Date.now()) + 7);
}

create("TASK-101", "Inspect the existing authentication boundaries");
create("TASK-102", "Define the passwordless session contract");
create("TASK-103", "Implement the backend flow");
create("TASK-104", "Implement the user-facing flow");
create("TASK-105", "Run integration verification", { approvalRequired: true });

plane.addDependency("TASK-102", "TASK-101");
plane.addDependency("TASK-103", "TASK-102");
plane.addDependency("TASK-104", "TASK-102");
plane.addDependency("TASK-105", "TASK-103");
plane.addDependency("TASK-105", "TASK-104");

console.log("\nYAAW Collab demonstration: passwordless login\n");

finish("TASK-101", "investigator", "reports/auth-boundaries.md", { now: 1_000 });
finish("TASK-102", "designer", "artifacts/session-contract.json", { now: 2_000 });

const parallel = plane.readyCandidates().map((task) => task.id).sort();
console.log("Parallel-safe work after TASK-102:", parallel.join(", "));

plane.markReady("TASK-103");
const crashed = plane.claim("TASK-103", "backend-worker-a", { now: 3_000, ttlMs: 20 });
plane.start("TASK-103", "backend-worker-a", crashed.lease, { now: 3_001 });
console.log("Simulating worker loss on TASK-103...");
plane.recoverExpiredLeases({ now: 3_021 });

const replacement = plane.claim("TASK-103", "backend-worker-b", { now: 3_021, ttlMs: 100 });
plane.start("TASK-103", "backend-worker-b", replacement.lease, { now: 3_022 });

try {
  plane.submitArtifact(
    "TASK-103",
    "backend-worker-a",
    crashed.lease,
    { kind: "commit", ref: "stale-worker-result" },
    { now: 3_023 }
  );
} catch (error) {
  console.log("Stale worker rejected:", error.message);
}

plane.submitArtifact(
  "TASK-103",
  "backend-worker-b",
  replacement.lease,
  { kind: "commit", ref: "commit/backend-passwordless" },
  { now: 3_024 }
);
plane.beginVerification("TASK-103", "backend-worker-b", replacement.lease, { now: 3_025 });
plane.recordCheck("TASK-103", { name: "backend-tests", passed: true }, { type: "system", id: "verification" }, 3_026);
plane.complete("TASK-103", { type: "system", id: "verification" }, 3_027);

finish("TASK-104", "frontend-worker", "commit/frontend-passwordless", { now: 4_000 });
finish("TASK-105", "qa-worker", "reports/passwordless-integration.md", { now: 5_000 });

console.log("\nFinal task states:");
for (const task of plane.tasks()) {
  console.log(`- ${task.id}: ${task.state}`);
}

const allComplete = plane.tasks().every((task) => task.state === TaskState.COMPLETE);
if (!allComplete) {
  process.exitCode = 1;
} else {
  console.log("\nResult: feature graph completed with evidence, verification, recovery, and approval.");
}
