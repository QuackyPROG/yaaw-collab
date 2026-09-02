# Implementation roadmap

Progression is gated by evidence. A later phase should not be treated as reliable merely because code exists.

## Phase 0 — domain contracts

**Included in the initial repository.**

- task state machine;
- DAG validation;
- event model;
- leases;
- fencing;
- idempotency model;
- artifact and verification gates;
- human approval gate.

**Exit:** invariant test suite passes.

## Phase 1 — PostgreSQL durable adapter

- migrations;
- task/event repositories;
- transactional claim;
- persistent fencing counters;
- atomic idempotency receipt;
- transactional outbox;
- migration CI.

**Exit:** concurrent-claim, restart, migration, and rollback tests pass.

## Phase 2 — scheduler and reconciler

- ready-task selection;
- lease expiry;
- retry classification;
- quarantine;
- desired/observed-state reconciliation;
- stall detection.

**Exit:** fault-injection suite recovers without duplicate authority.

## Phase 3 — generic worker protocol

- persistent agent identity;
- ephemeral sessions;
- capability declaration;
- task offer/accept/lease;
- heartbeats;
- progress and artifact protocol;
- cancellation.

**Exit:** replace a worker mid-task and reject stale writes.

## Phase 4 — isolated execution workspaces

- repository workspaces;
- base revision tracking;
- stale-base detection;
- resource locks;
- artifact lineage.

**Exit:** concurrent safe tasks do not share mutable state.

## Phase 5 — collaboration plane

- rooms;
- threads;
- task-linked messages;
- human UI;
- context summaries;
- collaboration adapters.

**Exit:** losing a chat notification cannot lose task state.

## Phase 6 — verification and source-host integration

- change requests;
- status checks;
- artifact digests;
- independent review;
- branch policy mapping.

**Exit:** task completion is traceable to immutable evidence.

## Phase 7 — context and decision memory

- project facts;
- decision records;
- provenance;
- freshness;
- task context packages;
- selective retrieval.

**Exit:** stale and speculative context are distinguishable.

## Phase 8 — policy gateway

- capability tokens;
- risk tiers;
- task-scoped authorization;
- approval evidence;
- audit.

**Exit:** worker compromise is bounded by task scope.

## Phase 9 — deployment workflows

- staging;
- canary;
- production;
- health gates;
- rollback.

**Exit:** failure-injection tests cover lost responses and duplicate requests.

## Phase 10 — autonomy expansion

Increase concurrent agents or delegation depth only from measured evidence:

- task success rate;
- duplicate-work rate;
- merge conflict rate;
- retry rate;
- human intervention rate;
- cost per accepted task;
- revert rate;
- failure-detection latency.
