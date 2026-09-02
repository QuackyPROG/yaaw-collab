# Contributing

Contributions are welcome. The project prefers small, evidence-backed pull requests over large rewrites.

## Requirements

- Node.js 24 LTS
- npm 11 or newer
- Git

## Setup

```bash
git clone https://github.com/QuackyPROG/yaaw-collab.git
cd yaaw-collab
npm ci
npm run check
npm run demo
```

## Branch workflow

Create a topic branch from the latest `main`:

```bash
git switch main
git pull --ff-only
git switch -c feat/short-description
```

Keep commits reviewable and scoped. A pull request should explain:

- the problem;
- the intended invariant or behavior;
- the implementation;
- tests added or changed;
- failure modes considered;
- compatibility or migration impact.

## Required validation

Run before opening a pull request:

```bash
npm run lint
npm test
npm run demo
```

Changes to architecture, reliability, authorization, persistence, or task semantics should include or update an ADR.

## Human review rule

Automated engineering assistance is permitted. The person opening the pull request remains accountable for understanding the patch and answering review questions. Maintainers accept changes based on evidence, tests, and review rather than tool provenance.

See `docs/development/human-review-policy.md`.
