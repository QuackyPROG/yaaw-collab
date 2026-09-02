# Contributor workflow

## 1. Open or select an issue

A good issue contains:

- observable problem or desired capability;
- boundaries;
- acceptance criteria;
- known risks.

## 2. Create a small branch

Use one topic per branch.

## 3. Implement with tests

Prefer tests that exercise public behavior and invariant boundaries.

## 4. Run local checks

```bash
npm run check
```

## 5. Open a pull request

Complete the pull request template.

## 6. Review

Review considers:

- correctness;
- invariant preservation;
- failure behavior;
- security;
- operability;
- test quality;
- documentation.

## 7. Merge

Protected `main` should require passing checks, resolved review conversations, and maintainer approval.

Exact repository settings are listed in `release-process.md`.
