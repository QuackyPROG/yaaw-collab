# Governance

YAAW Collab is maintained as a human-governed open-source engineering project.

## Decision ownership

The maintainer owns:

- project scope and release acceptance;
- architecture decisions and changes to invariants;
- security policy and risk exceptions;
- compatibility promises;
- merge approval for protected branches.

Implementation work may be delegated to automated engineering agents, but no implementation is accepted because an agent reports completion. Acceptance depends on reproducible checks, review, and maintainer approval.

## Maintainer

The founding maintainer is **QuackyPROG**.

Additional maintainers may be added after sustained, high-quality contributions. Maintainer access is not granted solely because of contribution volume.

## Architectural changes

Changes that alter any of the following require an Architecture Decision Record:

- authoritative state ownership;
- task lifecycle or transition rules;
- lease and fencing semantics;
- persistence guarantees;
- authorization boundaries;
- execution isolation;
- artifact verification;
- scheduler safety;
- release trust.

## Releases

A release must:

1. pass all required CI checks on the exact release commit;
2. have no unresolved high-severity security finding known to maintainers;
3. have an updated changelog;
4. preserve compatibility notes or document breaking changes;
5. be approved by a maintainer.

See `docs/development/release-process.md`.
