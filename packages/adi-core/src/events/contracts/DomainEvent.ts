export type EventMetadataValue = string | number | boolean | null;

export interface DomainEvent<TPayload = unknown> {
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly occurredAt: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly actorId?: string;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly payload: Readonly<TPayload>;
  readonly metadata?: Readonly<Record<string, EventMetadataValue>>;
}

export interface DomainEventInput<TPayload> {
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  payload: TPayload;
  eventVersion?: number;
  eventId?: string;
  occurredAt?: string;
  actorId?: string;
  correlationId?: string;
  causationId?: string;
  metadata?: Record<string, EventMetadataValue>;
}

let sequence = 0;
function createEventId(prefix = "evt"): string {
  sequence = (sequence + 1) % Number.MAX_SAFE_INTEGER;
  return `${prefix}_${Date.now().toString(36)}_${sequence.toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDomainEvent<TPayload>(input: DomainEventInput<TPayload>): DomainEvent<TPayload> {
  const eventId = input.eventId ?? createEventId();
  return Object.freeze({
    eventId,
    eventType: input.eventType,
    eventVersion: input.eventVersion ?? 1,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    aggregateId: input.aggregateId,
    aggregateType: input.aggregateType,
    actorId: input.actorId,
    correlationId: input.correlationId ?? eventId,
    causationId: input.causationId,
    payload: Object.freeze(input.payload),
    metadata: input.metadata ? Object.freeze({ ...input.metadata }) : undefined,
  });
}
