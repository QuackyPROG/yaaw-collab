# Use case: feature delivery

A developer requests:

> Add passwordless login without weakening session revocation.

## 1. Feature object

The lead creates a feature and acceptance criteria.

## 2. Work graph

```text
inspect-auth
    |
session-contract
   / \
backend  user-flow
   \      /
 integration
```

Only backend and user-flow are parallel after the contract exists.

## 3. Execution

Each mutation task receives:

- exact objective;
- current base revision;
- relevant decisions;
- isolated workspace;
- bounded capability;
- lease and fencing token.

## 4. Evidence

Workers return artifact references rather than conversational completion claims.

## 5. Verification

Backend and user-flow changes pass deterministic checks. Integration verification consumes both artifacts.

## 6. Approval

If session or deployment policy classifies the feature as high risk, a human approval state is required.

## 7. Completion

The feature is complete only when all required child tasks are complete and the final artifact lineage is recorded.

This workflow retains human visibility without requiring chat to act as the workflow database.
