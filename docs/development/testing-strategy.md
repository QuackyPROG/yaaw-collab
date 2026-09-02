# Testing strategy

The test pyramid is organized around failure boundaries rather than file count.

## Level 1: domain invariants

Fast tests cover:

- allowed task transitions;
- terminal states;
- dependency cycles;
- readiness;
- idempotency;
- leases;
- fencing;
- completion gates.

These tests are present in the initial repository.

## Level 2: durable adapter

Required before multi-host support:

- transaction rollback;
- concurrent task claims;
- atomic event append;
- atomic idempotency receipt;
- fencing persistence across restart;
- migration chain from an empty database;
- upgrade from prior release schema.

## Level 3: process failure

Kill workers and control-plane processes during:

- claim;
- heartbeat;
- artifact registration;
- verification;
- approval;
- completion.

The system must recover without silent duplication.

## Level 4: integration

Exercise:

- source host;
- CI provider;
- artifact store;
- collaboration adapter;
- worker runtime.

## Level 5: adversarial and load

Test:

- delayed messages;
- duplicate messages;
- webhook loss;
- long process pauses;
- clock skew;
- worker floods;
- recursive task proposals;
- hostile external text;
- cost limits.
