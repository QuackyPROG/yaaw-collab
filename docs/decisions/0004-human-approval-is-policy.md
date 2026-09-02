# ADR 0004: Human approval is a workflow policy, not a special chat message

**Status:** Accepted

## Context

Some operations can be automatically verified; others carry business, security, or production risk.

## Decision

Approval requirements are structured task policy. An authenticated approval event advances an approval-state task.

A message such as "looks good" is not sufficient unless an authenticated integration explicitly maps it to a policy-approved action.

## Consequences

- auditability;
- consistent approval regardless of collaboration surface;
- risk tiers can evolve without rewriting worker prompts.
