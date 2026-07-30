# AutoDosar — Implementation Status

| Issue | Componentă | Stare |
|---|---|---|
| ISSUE-001 | Core Domain Model v1.0 | Implementat — fundație inițială |
| ISSUE-002 | Digital Twin Engine | Implementat v1.0 |
| ISSUE-003 | Knowledge Engine 2.0 | Implementat — baseline |
| ISSUE-004 | Rule Engine | În lucru — Milestone 4.1 implementat |

## ISSUE-002 — Digital Twin Engine

**Stare:** implementat v1.0

Au fost adăugate creare, actualizare incrementală, versionare imuabilă, control optimist al concurenței, istoric, audit, diff, snapshot cu checksum și contract de repository. Implementarea in-memory este destinată testelor; persistența de producție va fi conectată în backend.


## ISSUE-003 — Knowledge Engine 2.0
Status: CLOSED (implementation baseline). Legal seed data requires verification before production.

## ISSUE-003.5 — Event Bus & Domain Events — CLOSED

Implemented asynchronous in-memory event bus, typed domain events, deterministic subscriptions, middleware, metrics, retry, dead-letter queue, correlation/causation tracing, Twin-to-Rule bridge and tests. See `docs/issues/ISSUE-003.5-EVENT-BUS-DOMAIN-EVENTS.md`.


## ISSUE-004 — Rule Engine — IN PROGRESS

Milestone 4.1 (Core) is implemented: contracts, repository, evaluator factory, executor, report aggregation, confidence score, tests and documentation. Decision Engine remains ISSUE-005.

## ISSUE-004 Rule Engine
- [x] 4.1 Rule Engine Core
- [x] 4.2 Explainable Rule System
- [ ] 4.3 Rule DSL
- [ ] 4.4 Knowledge Integration
- [ ] 4.5 Decision Integration
- [ ] 4.6 Workflow Integration


## ISSUE-004.3 — Rule DSL

Status: **Implemented**

- Serializable expression tree (`CONDITION`, `PREDICATE`, `AND`, `OR`, `NOT`)
- Domain predicate library for operation, applicant, proxy, vehicle, and documents
- Fluent typed `RuleBuilder`
- Rule metadata, legal references, recommendations, and next actions
- `RuleRegistry` and version-aware duplicate protection
- `RulePack` manifest and grouped registration
- Backward-compatible execution through the existing `RuleEngine`
- Dedicated DSL tests integrated into `npm run test:rules`
