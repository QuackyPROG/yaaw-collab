# ADR 0002: Task ownership uses leases and fencing tokens

**Status:** Accepted

## Context

A worker can disappear, pause, reconnect late, or continue operating after the scheduler has reassigned work.

## Decision

Ownership is time-bound by a lease. Each new lease receives a strictly increasing fencing token for the task.

Protected mutations require the current token.

## Consequences

- crashed workers do not own tasks forever;
- stale workers can be rejected after reassignment;
- downstream mutation services must participate in fencing for strong correctness;
- server time, not worker wall clock, determines expiry.
