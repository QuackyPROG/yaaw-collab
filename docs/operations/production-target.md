# Production target

The production target is deliberately stricter than the foundation demonstration.

## Required services

Minimum recommended deployment:

```text
API / control-plane process
        |
        +-- PostgreSQL
        |
        +-- scheduler / reconciler
        |
        +-- worker runtime adapters
        |
        +-- policy gateway
        |
        +-- observability backend
```

A separate message broker is optional at first. PostgreSQL can back the transactional outbox and work queue until measured scale justifies additional infrastructure.

## Availability

Before calling a deployment production-ready:

- run at least two stateless API replicas;
- ensure scheduler ownership is coordinated transactionally;
- back up PostgreSQL and test restore;
- expose liveness and readiness separately;
- monitor task stall rate, lease-expiry rate, retry rate, queue delay, and false-health incidents;
- test control-plane restart during active tasks.

## Durable release gate

Multi-host worker execution remains experimental until the PostgreSQL adapter passes the durable-adapter and process-failure test levels documented in `testing-strategy.md`.
