# Architecture overview

YAAW Collab is a control plane for coordinated work between humans and autonomous engineering agents.

Its central rule is:

> **Conversation communicates. Structured workflow state coordinates. Artifacts prove. Verification accepts. Policy authorizes.**

## Planes

### Collaboration plane

Humans and agents exchange messages, references, task-linked threads, and decisions. Conversation is useful context but never the authoritative representation of task ownership or completion.

### Control plane

The control plane owns:

- task objects and lifecycle;
- dependency graph;
- scheduling eligibility;
- leases and fencing tokens;
- retry and recovery state;
- approvals;
- policy decisions;
- durable event history.

### Execution plane

External agent runtimes execute scoped work inside isolated workspaces. An agent identity may survive many short-lived execution sessions.

### Artifact plane

Source revisions, patches, reports, build outputs, test results, review results, and deployment records are referenced as evidence.

### Observability plane

Metrics, traces, events, costs, liveness, readiness, stall detection, and reconciliation make false health difficult to hide.

## Source-of-truth hierarchy

1. platform policy;
2. project policy;
3. workflow state;
4. verified artifact state;
5. retrieved project facts with provenance;
6. agent reasoning;
7. conversational claims;
8. external untrusted text.

A message saying a task is complete cannot make the task complete. The state transition must satisfy the control-plane invariants.
