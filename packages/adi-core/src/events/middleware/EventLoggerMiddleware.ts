import type { DomainEvent } from "../contracts/DomainEvent";
import type { EventDispatchMiddleware, EventDispatchNext } from "../contracts/EventMiddleware";
import type { EventHandlerContext } from "../contracts/EventHandler";

export interface EventLogEntry {
  eventId: string;
  eventType: string;
  correlationId: string;
  attempt: number;
  status: "STARTED" | "COMPLETED" | "FAILED";
  timestamp: string;
  durationMs?: number;
  error?: string;
}

export type EventLogSink = (entry: EventLogEntry) => void;

export class EventLoggerMiddleware implements EventDispatchMiddleware {
  readonly name = "EventLoggerMiddleware";
  constructor(private readonly sink: EventLogSink = () => undefined) {}
  async handle(event: DomainEvent, context: EventHandlerContext, next: EventDispatchNext): Promise<void> {
    const started = Date.now();
    this.sink({ eventId: event.eventId, eventType: event.eventType, correlationId: event.correlationId, attempt: context.attempt, status: "STARTED", timestamp: new Date().toISOString() });
    try {
      await next();
      this.sink({ eventId: event.eventId, eventType: event.eventType, correlationId: event.correlationId, attempt: context.attempt, status: "COMPLETED", timestamp: new Date().toISOString(), durationMs: Date.now() - started });
    } catch (error) {
      this.sink({ eventId: event.eventId, eventType: event.eventType, correlationId: event.correlationId, attempt: context.attempt, status: "FAILED", timestamp: new Date().toISOString(), durationMs: Date.now() - started, error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }
}
