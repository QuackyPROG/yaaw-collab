# Repository settings

These settings are part of the delivery model and should be configured after the public repository is created.

## General

- default branch: `main`;
- issues: enabled;
- discussions: optional but recommended for design questions;
- wiki: optional;
- private vulnerability reporting: enabled when available;
- auto-delete head branches after merge: enabled.

## Pull requests

Recommended:

- squash merge: enabled;
- merge commits: optional;
- rebase merge: optional;
- automatically update pull request branches: enabled if team preference permits.

## Branch protection for `main`

Require:

- pull request before merge;
- at least one approval;
- approval of the most recent reviewable push;
- status check `CI / verify`;
- status check `CodeQL / Analyze`;
- review conversation resolution;
- no force push;
- no deletion.

Avoid permanent bypass actors. Emergency bypasses should be rare and documented.

## Actions

- default workflow token permission: read repository contents;
- grant write permissions only per workflow when required;
- require external Actions to be pinned to full-length commit SHAs when repository settings support enforcement;
- do not expose repository secrets to untrusted pull-request code.

## Security

Enable:

- dependency graph;
- Dependabot alerts;
- Dependabot security updates;
- secret scanning where available;
- push protection where available;
- static analysis results.

## Release

The release workflow requires `contents: write` only for the release job. Normal CI remains read-only.

## CODEOWNERS

`QuackyPROG` is the initial owner for all paths. As maintainers are added, narrow ownership should be introduced for security, workflows, domain invariants, and persistence.
