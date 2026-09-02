# Context and memory

The system should not solve isolation by dumping entire rooms into every agent session.

## Task context package

A worker receives a compact package containing:

- objective;
- acceptance criteria;
- dependencies and parent task;
- current project decisions;
- relevant file or artifact references;
- base revision;
- previous attempts and failure reasons;
- known constraints;
- recent task-linked conversation summary.

Everything else is retrieved on demand.

## Provenance

Memory items must retain source and freshness metadata.

A fact read directly from a versioned configuration file is not equivalent to a speculative message from an agent.

Recommended confidence classes:

- authoritative;
- verified;
- observed;
- inferred;
- speculative;
- untrusted external.

## Memory classes

Keep separate stores or logical collections for:

- project facts;
- architecture decisions;
- constraints;
- known issues;
- task history;
- operational state;
- user/project preferences.

Do not flatten all memory into one similarity index and treat retrieval rank as truth.
