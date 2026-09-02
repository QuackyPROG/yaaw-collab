import test from "node:test";
import assert from "node:assert/strict";
import { TaskState, assertTransition, isTerminalState } from "../src/task-state.js";

test("valid transition is accepted", () => {
  assert.doesNotThrow(() => assertTransition(TaskState.CREATED, TaskState.READY));
});

test("invalid shortcut to complete is rejected", () => {
  assert.throws(
    () => assertTransition(TaskState.RUNNING, TaskState.COMPLETE),
    /invalid task transition/
  );
});

test("terminal states cannot transition", () => {
  assert.equal(isTerminalState(TaskState.COMPLETE), true);
  assert.throws(
    () => assertTransition(TaskState.COMPLETE, TaskState.READY),
    /terminal task state/
  );
});
