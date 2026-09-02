import test from "node:test";
import assert from "node:assert/strict";
import { TaskGraph } from "../src/task-graph.js";

test("dependency graph rejects cycles", () => {
  const graph = new TaskGraph();
  graph.addDependency("B", "A");
  graph.addDependency("C", "B");
  assert.throws(() => graph.addDependency("A", "C"), /cycle/);
});

test("task readiness follows completed dependencies", () => {
  const graph = new TaskGraph();
  graph.addDependency("backend", "contract");
  assert.equal(graph.isReady("backend", new Set()), false);
  assert.equal(graph.isReady("backend", new Set(["contract"])), true);
});
