# ISSUE-003.5 — Event Bus & Domain Events

**Status:** CLOSED  
**Module:** `packages/adi-core/src/events`

## Delivered

- Strongly typed, immutable `DomainEvent` envelope.
- In-memory asynchronous event bus with priority ordering and wildcard subscriptions.
- Correlation and causation propagation.
- Sequential batch publication.
- Configurable retry, fail-fast behavior and dead-letter queue.
- Composable logging and metrics middleware.
- Canonical AutoDosar event catalog and payloads.
- Bridge from `twin.updated` to `rules.evaluation.requested`.
- Event recorder for integration tests.
- Unit/integration test covering ordering, bridge propagation, retry and DLQ.

## Acceptance criteria

- [x] Modules communicate through event contracts.
- [x] Handlers can subscribe and unsubscribe.
- [x] Handler priority is deterministic.
- [x] One failing handler does not silently lose an event.
- [x] Correlation and causation IDs survive a chained event.
- [x] Middleware is independent of business handlers.
- [x] Public API is exported from `@autodosar/adi-core`.
