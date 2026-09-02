# Human review policy

The project uses a human-governed development model.

## Human-owned responsibilities

Humans own:

- problem selection;
- architectural decisions;
- security exceptions;
- acceptance criteria;
- final review;
- merge approval;
- release approval.

## Automated implementation

Engineering agents may implement scoped tasks, create tests, analyze failures, or prepare documentation.

That does not transfer accountability.

The reviewer must be able to explain:

- what changed;
- why it is correct;
- what evidence supports it;
- what can still fail;
- how to roll it back or disable it.

## Acceptance rule

A task is not accepted because an agent says it is complete.

Acceptance requires the configured combination of:

- deterministic checks;
- artifact evidence;
- independent review;
- maintainer approval.

The same principle applies to this repository's own contribution process.
