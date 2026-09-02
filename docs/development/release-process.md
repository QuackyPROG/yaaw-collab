# Release process

## Branch protection target

Protect `main` with:

- pull request required;
- at least one approving review;
- approval of the most recent reviewable push;
- required status check: `CI / verify`;
- required status check: `CodeQL / Analyze`;
- conversation resolution required;
- force pushes disabled;
- branch deletion disabled.

When the repository grows beyond a single maintainer, add CODEOWNERS-based review for security- and workflow-critical areas.

## CI

Every pull request and push to `main` runs:

- repository policy checks;
- domain tests;
- demonstration workflow;
- static security analysis.

External Actions references are pinned to full commit SHAs.

## Release

Versioned release tags use `vMAJOR.MINOR.PATCH`.

The release workflow:

1. checks the repository;
2. creates a source artifact;
3. creates SHA-256 checksums;
4. publishes a GitHub Release.

A later phase adds signed provenance for distributable packages.

## Manual maintainer check

Before tagging:

```bash
npm ci
npm run check
git status --short
```

The working tree must be clean.
