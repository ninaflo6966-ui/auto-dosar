import type { DomainEvent } from "./DomainEvent";
import type { EventHandlerContext } from "./EventHandler";

export type EventDispatchNext = () => Promise<void>;

export interface EventDispatchMiddleware {
  readonly name: string;
  handle(event: DomainEvent, context: EventHandlerContext, next: EventDispatchNext): Promise<void>;
}
