import type { DomainEvent } from "../contracts/DomainEvent";
import type { EventDispatchMiddleware } from "../contracts/EventMiddleware";
import type { DeadLetterQueue } from "../contracts/EventFailure";
import type { EventHandler, EventSubscription, EventSubscriptionOptions } from "../contracts/EventHandler";
import type { EventPublishResult, IEventBus } from "../contracts/IEventBus";

interface RegisteredHandler {
  subscriptionId: string;
  handlerId: string;
  eventType: string;
  priority: number;
  order: number;
  handler: EventHandler;
}

export interface InMemoryEventBusOptions {
  middleware?: readonly EventDispatchMiddleware[];
  deadLetterQueue?: DeadLetterQueue;
  maxRetries?: number;
  retryDelayMs?: number;
  failFast?: boolean;
}

let subscriptionSequence = 0;

export class InMemoryEventBus implements IEventBus {
  private readonly handlers = new Map<string, RegisteredHandler[]>();
  private readonly middleware: readonly EventDispatchMiddleware[];
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;
  private readonly failFast: boolean;
  private order = 0;

  constructor(private readonly options: InMemoryEventBusOptions = {}) {
    this.middleware = options.middleware ?? [];
    this.maxRetries = Math.max(0, options.maxRetries ?? 0);
    this.retryDelayMs = Math.max(0, options.retryDelayMs ?? 0);
    this.failFast = options.failFast ?? false;
  }

  subscribe<TEvent extends DomainEvent>(
    eventType: string,
    handler: EventHandler<TEvent>,
    options: EventSubscriptionOptions = {},
  ): EventSubscription {
    if (!eventType.trim()) throw new Error("eventType must not be empty");
    const subscriptionId = `sub_${++subscriptionSequence}`;
    const registered: RegisteredHandler = {
      subscriptionId,
      handlerId: options.handlerId ?? subscriptionId,
      eventType,
      priority: options.priority ?? 0,
      order: this.order++,
      handler: handler as EventHandler,
    };
    const bucket = this.handlers.get(eventType) ?? [];
    bucket.push(registered);
    bucket.sort((a, b) => b.priority - a.priority || a.order - b.order);
    this.handlers.set(eventType, bucket);

    return {
      subscriptionId,
      eventType,
      handlerId: registered.handlerId,
      unsubscribe: () => this.unsubscribe(subscriptionId, eventType),
    };
  }

  async publish<TEvent extends DomainEvent>(event: TEvent): Promise<EventPublishResult> {
    this.assertEvent(event);
    const started = Date.now();
    const handlers = [
      ...(this.handlers.get(event.eventType) ?? []),
      ...(this.handlers.get("*") ?? []),
    ].sort((a, b) => b.priority - a.priority || a.order - b.order);

    let successfulHandlers = 0;
    let failedHandlers = 0;
    for (const registered of handlers) {
      const success = await this.dispatchToHandler(event, registered);
      if (success) successfulHandlers += 1;
      else {
        failedHandlers += 1;
        if (this.failFast) break;
      }
    }

    return {
      eventId: event.eventId,
      eventType: event.eventType,
      matchedHandlers: handlers.length,
      successfulHandlers,
      failedHandlers,
      durationMs: Date.now() - started,
    };
  }

  async publishMany(events: readonly DomainEvent[]): Promise<readonly EventPublishResult[]> {
    const results: EventPublishResult[] = [];
    for (const event of events) results.push(await this.publish(event));
    return results;
  }

  clear(): void {
    this.handlers.clear();
  }

  private unsubscribe(subscriptionId: string, eventType: string): void {
    const bucket = this.handlers.get(eventType);
    if (!bucket) return;
    const next = bucket.filter((item) => item.subscriptionId !== subscriptionId);
    if (next.length) this.handlers.set(eventType, next);
    else this.handlers.delete(eventType);
  }

  private async dispatchToHandler(event: DomainEvent, registered: RegisteredHandler): Promise<boolean> {
    let attempt = 0;
    while (attempt <= this.maxRetries) {
      attempt += 1;
      const context = { attempt, publishedAt: new Date().toISOString() };
      try {
        const terminal = async () => { await registered.handler(event, context); };
        await this.runMiddleware(event, context, terminal);
        return true;
      } catch (error) {
        if (attempt <= this.maxRetries) {
          if (this.retryDelayMs > 0) await new Promise((resolve) => setTimeout(resolve, this.retryDelayMs));
          continue;
        }
        await this.options.deadLetterQueue?.add({
          event,
          handlerId: registered.handlerId,
          attempts: attempt,
          failedAt: new Date().toISOString(),
          errorName: error instanceof Error ? error.name : "UnknownError",
          errorMessage: error instanceof Error ? error.message : String(error),
        });
        return false;
      }
    }
    return false;
  }

  private async runMiddleware(
    event: DomainEvent,
    context: { attempt: number; publishedAt: string },
    terminal: () => Promise<void>,
  ): Promise<void> {
    let index = -1;
    const dispatch = async (position: number): Promise<void> => {
      if (position <= index) throw new Error("Event middleware called next() more than once");
      index = position;
      const middleware = this.middleware[position];
      if (!middleware) return terminal();
      await middleware.handle(event, context, () => dispatch(position + 1));
    };
    await dispatch(0);
  }

  private assertEvent(event: DomainEvent): void {
    if (!event.eventId || !event.eventType || !event.aggregateId || !event.correlationId) {
      throw new Error("Invalid domain event: eventId, eventType, aggregateId and correlationId are required");
    }
  }
}
