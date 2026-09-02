# Reliability model

The reliability model assumes processes pause, hosts die, networks partition, requests repeat, webhooks disappear, and workers return after they should have lost authority.

## Leases

Task ownership is time-bound. A worker must renew its lease. If renewal stops, the reconciler can return the task to a schedulable state.

A lease is not enough for correctness.

## Fencing tokens

Every successful claim increments a per-task fencing token.

All protected mutations from a worker carry the token. If worker A loses token 8 and worker B later receives token 9, writes carrying token 8 must be rejected even if worker A resumes.

This closes the zombie-worker hole caused by long pauses, delayed packets, or partial partitions.

## Idempotency

Mutation commands carry stable request IDs. Retrying the same command returns the original outcome. Reusing the request ID for different intent is rejected.

Production persistence must store command receipt and state mutation atomically.

## Reconciliation

Event delivery is not trusted as the only mechanism.

Control loops periodically compare desired workflow state with observed external state. Examples:

- task says running but lease expired;
- pull request is merged but task still says verifying;
- worker appears connected but end-to-end probe fails;
- deployment record says pending but deployment provider says failed.

## Retry classification

Retries are bounded and failure-aware:

- transient transport error: retry with backoff and jitter;
- invalid code or failed deterministic check: return to reasoning, not blind retry;
- authorization failure: stop and escalate;
- runtime loss: replace session;
- repeated crash: quarantine;
- semantic conflict: reconciliation required.

No infinite retry loop is permitted.
