import type { DomainEvent } from "./DomainEvent";
import type { EventHandler, EventSubscription, EventSubscriptionOptions } from "./EventHandler";

export interface EventPublishResult {
  readonly eventId: string;
  readonly eventType: string;
  readonly matchedHandlers: number;
  readonly successfulHandlers: number;
  readonly failedHandlers: number;
  readonly durationMs: number;
}

export interface IEventBus {
  publish<TEvent extends DomainEvent>(event: TEvent): Promise<EventPublishResult>;
  publishMany(events: readonly DomainEvent[]): Promise<readonly EventPublishResult[]>;
  subscribe<TEvent extends DomainEvent>(
    eventType: string,
    handler: EventHandler<TEvent>,
    options?: EventSubscriptionOptions,
  ): EventSubscription;
  clear(): void;
}
