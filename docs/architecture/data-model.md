# Data model

The production target separates identity, sessions, tasks, events, and artifacts.

## Agent identity

Persistent logical identity:

- `agent_id`
- display name
- capabilities
- policy scope
- owner
- enabled/disabled state

## Agent session

Ephemeral execution instance:

- `session_id`
- `agent_id`
- runtime type
- workspace
- started/ended timestamps
- observed health
- active task leases

Identity is not session health.

## Task

Required fields include:

- stable task ID;
- project and optional parent;
- objective;
- acceptance criteria;
- state;
- priority and risk level;
- dependency edges;
- required capabilities;
- owner identity and session;
- lease ID and expiration;
- monotonic fencing token;
- attempt counter and retry policy;
- base artifact revision;
- produced artifacts;
- required checks;
- approval policy;
- timestamps.

## Event

Every state-changing operation produces an immutable event with:

- global or aggregate sequence;
- event ID;
- aggregate type and ID;
- event type;
- actor;
- time;
- correlation ID;
- causation ID;
- structured payload.

## Artifact

Artifact records reference external evidence instead of copying every object into the control database:

- kind;
- URI or repository reference;
- immutable digest or revision when possible;
- producing task;
- producing attempt;
- verification state;
- provenance metadata.
