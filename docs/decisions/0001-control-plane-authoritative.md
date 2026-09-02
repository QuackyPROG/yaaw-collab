# ADR 0001: Control plane is authoritative

**Status:** Accepted

## Context

Conversation is flexible but ambiguous. Messages can be missed, repeated, edited, summarized incorrectly, or observed by different participants at different times.

## Decision

Task ownership, lifecycle, dependencies, verification, approval, and completion are represented as structured control-plane state.

Conversation may request or explain a transition. It cannot define the transition by itself.

## Consequences

- more schema and domain logic;
- simpler recovery and audit;
- machine-readable ownership;
- reduced reliance on context reconstruction;
- collaboration adapters can fail without erasing workflow truth.
