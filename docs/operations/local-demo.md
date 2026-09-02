# Local demonstration

The foundation release is dependency-light and runs entirely in-process.

## Requirements

- Node.js 24 LTS
- npm 11+
- Git

## Run

```bash
npm ci
npm run check
```

Or run only the scenario:

```bash
npm run demo
```

## Scenario

The demonstration models a passwordless-login feature:

1. authentication boundaries are inspected;
2. a session contract is defined;
3. backend and user-facing tasks become parallel-safe;
4. one backend worker loses its lease;
5. reconciliation returns the task to ready;
6. a replacement worker receives a higher fencing token;
7. the stale worker attempts to submit an artifact and is rejected;
8. artifacts are recorded;
9. verification checks are recorded;
10. integration verification requires human approval;
11. all tasks complete.

The output is intentionally readable because the reference implementation doubles as an executable architecture example.

## What this proves

It proves the in-process domain implementation enforces the tested invariants.

It does not prove:

- durable crash recovery across a control-plane restart;
- transactional claims across multiple hosts;
- external credential policy;
- production collaboration adapters;
- deployment safety.

Those capabilities have explicit roadmap gates.
