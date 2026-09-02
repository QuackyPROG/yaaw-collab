# YAAW Collab

**YAAW Collab is a human-governed control plane for reliable collaboration between people and autonomous engineering agents.**

It is built around one separation:

> **Conversation communicates. Tasks coordinate. Artifacts prove. Verification accepts. Policy authorizes. Leases own. The event log remembers.**

## Why this exists

Agent collaboration becomes fragile when chat is also expected to represent task ownership, retries, dependencies, approvals, completion, and recovery.

YAAW Collab separates those concerns:

```text
Humans + agents
      |
collaboration
      |
control plane
  |   |   |
tasks graph policy
      |
execution sessions
      |
artifacts
      |
verification
```

The control plane is authoritative. A worker saying "done" is not completion. Completion is a valid state transition backed by required evidence.

The project rationale is documented in [`docs/evidence/engineering-evidence.md`](docs/evidence/engineering-evidence.md), with sources covering multi-agent scaling, leases, fencing, idempotency, reconciliation, durable execution, secure software development, and software supply-chain controls.

## Status

**Foundation / pre-1.0.**

The repository currently provides an executable reference implementation of the core domain invariants:

- explicit task state machine;
- dependency DAG with cycle rejection;
- dependency-aware readiness;
- time-bound task leases;
- monotonic fencing tokens;
- stale-worker rejection;
- idempotent command replay;
- append-only event history;
- artifact-before-verification rule;
- verification-before-completion rule;
- human approval gate;
- expired-lease reconciliation;
- runnable end-to-end feature scenario.

It does **not** yet claim production-grade multi-host durability. PostgreSQL persistence, worker protocol, collaboration adapters, policy gateway, and deployment orchestration are staged behind explicit roadmap gates.

See [`docs/roadmap/phases.md`](docs/roadmap/phases.md).

## Requirements

For the current foundation:

- Git
- Node.js **24 LTS**
- npm **11+**

Node.js 24 is an LTS line suitable for production application development.

## Setup from a fresh checkout

### 1. Get the repository

```bash
git clone https://github.com/QuackyPROG/yaaw-collab.git
cd yaaw-collab
```

### 2. Select Node.js 24

With `nvm`:

```bash
nvm install
nvm use
```

Verify:

```bash
node --version
npm --version
```

### 3. Install

The foundation has no third-party runtime dependency, but use the lockfile so local and CI behavior stay aligned:

```bash
npm ci
```

### 4. Run all checks

```bash
npm run check
```

That runs repository policy checks, domain tests, and the real demonstration workflow.

### 5. Run only the demonstration

```bash
npm run demo
```

## Real example: passwordless login

The included scenario models a feature with dependent and parallel work:

```text
Inspect authentication
        |
Define session contract
       / \
 Backend  User flow
       \ /
   Integration QA
```

After the session contract completes, the backend and user-flow tasks become parallel-safe.

During the demonstration, the first backend worker loses its lease. Reconciliation returns the task to `ready`, a replacement worker gets a higher fencing token, and the stale worker is rejected when it tries to submit work.

The final integration task records artifact evidence, a verification check, and a human approval before completion.

Run:

```bash
npm run demo
```

For the full walkthrough, see [`docs/operations/local-demo.md`](docs/operations/local-demo.md).

## What not to build

YAAW Collab explicitly avoids several common failure patterns:

- chat as the workflow database;
- ownership without expiration;
- "process exists" as agent health;
- unbounded retries;
- recursive worker spawning without budgets;
- shared mutable workspaces for independent workers;
- automatic trust in a worker's completion claim;
- indiscriminate multi-agent parallelism;
- one broad credential shared by every worker;
- production mutation without explicit policy;
- silent event loss;
- floating CI workflow dependencies.

See [`docs/evidence/failure-catalog.md`](docs/evidence/failure-catalog.md).

## Repository layout

```text
apps/demo/                 runnable end-to-end scenario
packages/core/             executable domain reference
docs/architecture/         system contracts
docs/decisions/            architecture decision records
docs/development/          contribution and release policy
docs/evidence/             research and failure rationale
docs/operations/           setup and deployment targets
docs/roadmap/              implementation ladder
docs/use-cases/            real engineering scenarios
.github/                   CI, security analysis, templates, ownership
```

## Architecture

Read these in order:

1. [`docs/architecture/overview.md`](docs/architecture/overview.md)
2. [`docs/architecture/control-plane.md`](docs/architecture/control-plane.md)
3. [`docs/architecture/reliability.md`](docs/architecture/reliability.md)
4. [`docs/architecture/security.md`](docs/architecture/security.md)
5. [`docs/architecture/scheduler.md`](docs/architecture/scheduler.md)
6. [`docs/evidence/engineering-evidence.md`](docs/evidence/engineering-evidence.md)

## Development model

The project is human-governed.

Maintainers own architecture decisions, acceptance criteria, security exceptions, merge approval, and releases. Automated engineering agents may implement scoped tasks, but changes are accepted only after reproducible checks and human review.

See [`docs/development/human-review-policy.md`](docs/development/human-review-policy.md).

## Contributing

Start with [`CONTRIBUTING.md`](CONTRIBUTING.md).

Local validation:

```bash
npm run check
```

The intended `main` policy requires pull requests, required CI, resolved review conversations, and maintainer approval. See [`docs/development/release-process.md`](docs/development/release-process.md).

After creating the public repository, apply the recommended GitHub settings in [`docs/development/repository-settings.md`](docs/development/repository-settings.md).

## Security

Read [`SECURITY.md`](SECURITY.md) before reporting a vulnerability.

The architecture treats external text and autonomous workers as untrusted-by-default inputs to a policy-controlled system.

## License and credit

YAAW Collab is released under the [MIT License](LICENSE).

Copyright © 2026 **QuackyPROG**.

The license allows use, copying, modification, publication, distribution, sublicensing, and sale, provided the copyright and permission notice are retained in copies or substantial portions.

Original authorship is also recorded in [`AUTHORS.md`](AUTHORS.md).
