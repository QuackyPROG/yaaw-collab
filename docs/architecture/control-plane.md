# Control plane

## Responsibilities

The control plane is the single authority for workflow state.

A production implementation must provide:

- atomic task transitions;
- durable event append;
- dependency validation;
- atomic lease grants;
- monotonic fencing tokens;
- idempotent mutation handling;
- scheduler coordination;
- approval records;
- cancellation and supersession;
- reconciliation against external systems.

## Task lifecycle

The reference lifecycle is:

```text
created
  -> ready
  -> claimed
  -> running
  -> verifying
  -> approval (when policy requires)
  -> complete
```

Alternate paths cover blocking, revalidation, reconciliation, quarantine, cancellation, expiration, supersession, and permanent failure.

A state transition is a domain operation, not a chat command.

## Current executable foundation

The initial repository includes an in-process reference implementation of:

- lifecycle validation;
- DAG dependency validation;
- task leases;
- fencing tokens;
- idempotent command replay;
- append-only event history;
- artifact-before-verification enforcement;
- verification-before-completion enforcement;
- human approval enforcement;
- expired-lease recovery.

It is a specification executable enough to test invariants. It is not a multi-host persistence layer.

## Production target

The first durable adapter uses PostgreSQL transactions as the authority for:

- tasks;
- dependencies;
- events;
- command receipts;
- leases and fencing counters;
- approvals;
- artifacts.

The durable adapter is a release gate before multi-host workers are considered supported.
