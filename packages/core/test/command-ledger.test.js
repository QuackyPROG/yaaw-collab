import test from "node:test";
import assert from "node:assert/strict";
import { CommandLedger } from "../src/command-ledger.js";

test("replayed command returns the original result without re-execution", () => {
  const ledger = new CommandLedger();
  let executions = 0;
  const op = () => ({ execution: ++executions });

  const first = ledger.execute("request-1", "same", op);
  const second = ledger.execute("request-1", "same", op);

  assert.deepEqual(second, first);
  assert.equal(executions, 1);
});

test("reusing an idempotency key for different intent is rejected", () => {
  const ledger = new CommandLedger();
  ledger.execute("request-1", "create:A", () => "ok");
  assert.throws(
    () => ledger.execute("request-1", "create:B", () => "bad"),
    /different command/
  );
});
