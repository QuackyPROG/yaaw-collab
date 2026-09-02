# Security model

Agent execution is treated as a privileged automation problem, not a trusted-chat problem.

## Capability model

Agents receive the minimum capability needed for the active task. Production credentials should be short-lived and task-scoped where the external system supports it.

Examples:

- repository read;
- branch-scoped repository write;
- test execution;
- artifact upload;
- staging deployment;
- production deployment.

These are separate capabilities.

## Approval tiers

Suggested risk tiers:

| Tier | Example | Default |
| --- | --- | --- |
| R0 | Read project data | automatic |
| R1 | Produce analysis | automatic |
| R2 | Modify isolated workspace | automatic with audit |
| R3 | Open a change request | automatic or project policy |
| R4 | Merge protected branch | human or strong policy gate |
| R5 | Database/schema change | human plus deterministic checks |
| R6 | Production deployment | explicit approval or strict deployment policy |
| R7 | Credential/security-control mutation | explicit privileged approval |

## Prompt-injection boundary

Text from issues, messages, web pages, logs, documents, and retrieved artifacts is data unless an authenticated policy layer grants it authority.

External text cannot widen its own permissions.

## Tool gateway target

A production deployment should route sensitive operations through a policy-aware gateway that evaluates:

- actor;
- task;
- current lease and fencing token;
- requested capability;
- target resource;
- approval evidence;
- risk tier;
- expiration.

The initial executable foundation does not include a production credential gateway.
