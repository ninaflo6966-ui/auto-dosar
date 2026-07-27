import type { DomainEvent } from "./DomainEvent";

export interface EventHandlerContext {
  readonly attempt: number;
  readonly publishedAt: string;
}

export type EventHandler<TEvent extends DomainEvent = DomainEvent> = (
  event: TEvent,
  context: EventHandlerContext,
) => void | Promise<void>;

export interface EventSubscriptionOptions {
  priority?: number;
  handlerId?: string;
}

export interface EventSubscription {
  readonly subscriptionId: string;
  readonly eventType: string;
  readonly handlerId: string;
  unsubscribe(): void;
}
