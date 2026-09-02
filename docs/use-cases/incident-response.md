# Use case: incident response

A production symptom appears:

> Authentication requests began returning elevated 500 responses after a release.

## Desired behavior

1. Incident task captures time, affected service, and severity.
2. Investigation tasks may parallelize where evidence is independent: logs, recent changes, metrics.
3. A central incident lead prevents independent investigators from making production changes.
4. Candidate remediation becomes a separate mutation task.
5. Verification requires reproduction or measurable health recovery.
6. Production action follows the configured approval tier.
7. Reconciliation confirms the external deployment state.
8. Post-incident decisions become durable records.

## Safety rule

Investigation capability does not imply production mutation capability.
