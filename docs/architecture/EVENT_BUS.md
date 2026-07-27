# AutoDosar Event Bus

The event bus is an in-process integration boundary for domain modules. It is deliberately transport-neutral: a future NestJS, RabbitMQ, Kafka or outbox adapter can implement `IEventBus` without changing publishers and subscribers.

## Event envelope

Every event contains identity, type/version, timestamp, aggregate identity, actor, correlation, optional causation, immutable payload and metadata.

## Delivery semantics

The current adapter provides deterministic in-process **at-least-once attempts** when retries are enabled. Handlers must therefore be idempotent. It does not claim durable delivery; production durability requires a transactional outbox and persistent broker.

## Ordering

Handlers are ordered by descending priority, then subscription order. Events passed to `publishMany` are published sequentially.

## Failure policy

A handler is retried up to `maxRetries`. Exhausted failures are written to `DeadLetterQueue`. `failFast=false` lets other subscribers continue.

## Event chain example

`document.uploaded` → OCR handler → `ocr.completed` → Twin handler → `twin.updated` → `rules.evaluation.requested`.

The chain shares `correlationId`; each derived event points to its direct parent through `causationId`.
