# AutoDosar — Implementation Status

| Issue | Componentă | Stare |
|---|---|---|
| ISSUE-001 | Core Domain Model v1.0 | Implementat — fundație inițială |
| ISSUE-002 | Digital Twin Engine | Următorul |
| ISSUE-003 | Knowledge Engine 2.0 | Planificat |
| ISSUE-004 | Rule & Decision Engine | Planificat |

## ISSUE-002 — Digital Twin Engine

**Stare:** implementat v1.0

Au fost adăugate creare, actualizare incrementală, versionare imuabilă, control optimist al concurenței, istoric, audit, diff, snapshot cu checksum și contract de repository. Implementarea in-memory este destinată testelor; persistența de producție va fi conectată în backend.


## ISSUE-003 — Knowledge Engine 2.0
Status: CLOSED (implementation baseline). Legal seed data requires verification before production.

## ISSUE-003.5 — Event Bus & Domain Events — CLOSED

Implemented asynchronous in-memory event bus, typed domain events, deterministic subscriptions, middleware, metrics, retry, dead-letter queue, correlation/causation tracing, Twin-to-Rule bridge and tests. See `docs/issues/ISSUE-003.5-EVENT-BUS-DOMAIN-EVENTS.md`.
