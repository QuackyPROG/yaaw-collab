# Failure catalog

This catalog converts known distributed-system and agent-workflow failure modes into explicit project requirements.

| Failure | Unsafe outcome | Required control |
| --- | --- | --- |
| Worker process dies | task stuck forever | expiring lease + reconciliation |
| Runtime bridge alive, worker session dead | false healthy | end-to-end capability probe |
| Worker returns after replacement | stale write | fencing token |
| Request is retried | duplicate side effect | idempotency key |
| Event notification is lost | state never advances | reconciliation |
| Control plane restarts | workflow forgotten | durable persistence |
| Two schedulers race | duplicate ownership | transactional claim |
| Dependency cycle | permanent deadlock | DAG validation |
| Sequential work is over-parallelized | conflicts and error amplification | dependency-aware scheduler |
| Agent says "done" without evidence | false completion | artifact + verification gates |
| Verification tool is unavailable | false pass | remain pending / fail closed |
| Same worker builds and solely approves | correlated error | independent check or human approval |
| Base revision becomes stale | invalid change | base-revision freshness check |
| Dependency artifact changes | downstream result stale | lineage + revalidation |
| Repeated crash on same task | retry storm | bounded retries + quarantine |
| Authorization denied | wasteful retry loop | failure classification + escalation |
| Network partition | split ownership | lease + fencing + server-side token check |
| Clock drift | wrong expiry assumptions | server-authoritative time |
| Requirement changes mid-run | obsolete work continues | task revision + supersession |
| Human changes external state directly | control plane drifts | reconciliation |
| External text contains hostile instructions | tool misuse | trust labels + policy boundary |
| Sensitive credential is over-scoped | excessive blast radius | short-lived scoped capability |
| Agent tree expands recursively | cost explosion | spawn/depth budgets |
| Artifact upload partially fails | false evidence | atomic artifact registration |
| Migration tests skip real migration chain | production upgrade breakage | clean-db + upgrade-path CI |
| Release workflow action reference moves | supply-chain drift | full-SHA workflow pinning |
