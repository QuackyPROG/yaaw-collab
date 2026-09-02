# Engineering evidence and design rationale

YAAW Collab treats its architecture as a set of claims that should be traceable to research, established distributed-systems practice, or observed engineering failure modes.

This document records the main evidence behind the current design. It is not a claim that any external system proves this implementation correct. Each source supports a design direction; project tests and production evidence must validate the actual implementation.

## 1. More agents are not automatically better

**Source:** Google Research, *Towards a science of scaling agent systems: When and why agent systems work* (2026).  
https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/

The controlled study evaluated 180 agent configurations and reported that multi-agent coordination helps decomposable parallel tasks but can degrade sequential tasks. It also reported substantially larger error amplification for independent multi-agent systems than for centralized coordination.

**Design consequence:**

- dependency graph before parallel dispatch;
- centralized control-plane validation;
- bounded worker count;
- no permanent corporate-style hierarchy;
- independent reviewer/check stages for risky work.

## 2. Multi-agent systems add coordination and reliability costs

**Source:** Anthropic Engineering, *How we built our multi-agent research system* (2025).  
https://www.anthropic.com/engineering/multi-agent-research-system

The production engineering report describes coordination, evaluation, reliability, and resource-cost challenges in multi-agent systems.

**Design consequence:**

- parallelism is used selectively;
- budgets are first-class workflow state;
- task boundaries must be explicit;
- completion requires artifacts and verification.

## 3. Time-bound ownership is an established distributed-systems mechanism

**Source:** Gray, C. G. and Cheriton, D. R., *Leases: An Efficient Fault-Tolerant Mechanism for Distributed File Cache Consistency*, SOSP 1989.  
DOI: https://doi.org/10.1145/74850.74870

**Design consequence:**

- task ownership expires;
- a crashed worker cannot hold a task forever;
- recovery is a normal control-plane behavior.

## 4. Leases alone do not stop stale workers

**Source:** Martin Kleppmann, *How to do distributed locking* (2016).  
https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html

The stale-client example shows why a worker that wakes after lease expiration may still issue dangerous writes. Fencing tokens allow downstream systems to reject writes from an older lease holder.

**Design consequence:**

- every claim increments a monotonic fencing token;
- sensitive mutations carry the token;
- newer ownership invalidates stale workers.

## 5. Duplicate delivery must not duplicate side effects

**Source:** Unmesh Joshi, *Idempotent Receiver*, Patterns of Distributed Systems (2023).  
https://martinfowler.com/articles/patterns-of-distributed-systems/idempotent-receiver.html

**Design consequence:**

- mutation commands use stable idempotency keys;
- replay returns the original result;
- reuse of the same key for different intent is rejected;
- durable implementations store receipt and mutation atomically.

## 6. Reconciliation is safer than trusting event delivery alone

**Source:** Kubernetes documentation, *Controllers*.  
https://kubernetes.io/docs/concepts/architecture/controller/

Kubernetes controllers continuously compare desired and current state and act to move the system toward the desired state.

**Design consequence:**

- periodic reconciliation is a core subsystem;
- external systems are re-read;
- health is based on observed ability, not process presence alone;
- missed notifications must be repairable.

## 7. Durable workflows persist state across process failure

**Source:** Temporal documentation, *Durable Execution*.  
https://docs.temporal.io/

Durable workflow systems persist progress so execution can resume after infrastructure failures.

**Design consequence:**

- workflow state belongs in durable storage before multi-host execution;
- in-memory event buffers are never the production source of truth;
- crash recovery is tested deliberately.

YAAW Collab does not require Temporal. The source is used as evidence for the durability requirement.

## 8. Secure software delivery requires explicit process controls

**Source:** NIST SP 800-218, *Secure Software Development Framework (SSDF) Version 1.1*.  
https://csrc.nist.gov/pubs/sp/800/218/final

**Design consequence:**

- security policy is part of the repository;
- changes pass repeatable verification;
- vulnerabilities have a private reporting path;
- release and contribution processes are documented.

## 9. CI dependencies are part of the supply chain

**Source:** GitHub, *Secure use reference*.  
https://docs.github.com/en/actions/reference/security/secure-use

GitHub recommends pinning Actions to full-length commit SHAs when immutable action references are required.

**Design consequence:**

- external workflow actions are pinned to full commit SHAs;
- repository checks fail on floating workflow action references.

## 10. Build provenance improves artifact traceability

**Source:** SLSA v1.2 Build Track.  
https://slsa.dev/spec/v1.2/build-track-basics

**Design consequence:**

- releases carry cryptographic checksums;
- release automation is structured so provenance attestation can be added as the project begins publishing distributable binaries or packages.

## What counts as project proof

External literature justifies design choices. It does not prove YAAW Collab works.

Project proof comes from:

- invariant tests;
- failure-injection tests;
- concurrency tests;
- crash/restart tests against the durable adapter;
- stale-worker rejection tests;
- migration-from-empty and upgrade tests;
- end-to-end contribution CI;
- production telemetry once deployments exist.

The roadmap blocks higher autonomy levels until the lower-layer evidence exists.
