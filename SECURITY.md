# Security Policy

## Supported versions

The project is currently pre-1.0. Security fixes are applied to the latest development line unless a release note explicitly states otherwise.

## Reporting a vulnerability

Do not open a public issue for a vulnerability that could be exploited before a fix is available.

Report privately to the maintainer through GitHub's private vulnerability reporting feature when enabled. If that feature is unavailable, contact **QuackyPROG** through the contact methods listed on the GitHub profile and clearly mark the message as a security report.

Include:

- affected revision or release;
- impact;
- reproduction conditions;
- minimal proof of concept when safe;
- suggested mitigation if known.

Do not include real credentials, production tokens, personal data, or unrelated private information.

## Security posture

The repository treats agent execution as untrusted-by-default automation. Production access, credential distribution, merge authority, and deployment authority must be bounded by external policy and explicit approval.

The security architecture is documented in `docs/architecture/security.md`.
