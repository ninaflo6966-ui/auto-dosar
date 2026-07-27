import type { DomainEvent } from "../contracts/DomainEvent";
import type { EventPublishResult, IEventBus } from "../contracts/IEventBus";

export class EventPublisher {
  constructor(private readonly eventBus: IEventBus) {}
  publish(event: DomainEvent): Promise<EventPublishResult> { return this.eventBus.publish(event); }
  publishMany(events: readonly DomainEvent[]): Promise<readonly EventPublishResult[]> { return this.eventBus.publishMany(events); }
}
