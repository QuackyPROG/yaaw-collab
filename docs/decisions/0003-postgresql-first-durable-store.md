# ADR 0003: PostgreSQL is the first durable control store

**Status:** Accepted for Phase 1

## Context

The project needs transactions across task state, ownership, events, command receipts, and graph changes. Adding several infrastructure systems before scale is measured increases operational failure surfaces.

## Decision

Use PostgreSQL as the initial durable authority and implement the queue/outbox pattern there first.

Introduce a separate broker only when measured throughput, latency, or isolation requirements justify it.

## Consequences

- fewer services in the early production topology;
- transactional state and event/outbox writes;
- database contention must be measured;
- migrations become safety-critical and receive dedicated CI.
