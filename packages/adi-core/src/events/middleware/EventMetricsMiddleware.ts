import type { DomainEvent } from "../contracts/DomainEvent";
import type { EventDispatchMiddleware, EventDispatchNext } from "../contracts/EventMiddleware";
import type { EventHandlerContext } from "../contracts/EventHandler";

export interface EventMetric {
  count: number;
  failures: number;
  totalDurationMs: number;
  lastDurationMs: number;
}

export class EventMetricsMiddleware implements EventDispatchMiddleware {
  readonly name = "EventMetricsMiddleware";
  private readonly metrics = new Map<string, EventMetric>();

  async handle(event: DomainEvent, _context: EventHandlerContext, next: EventDispatchNext): Promise<void> {
    const started = Date.now();
    let failed = false;
    try { await next(); } catch (error) { failed = true; throw error; }
    finally {
      const duration = Date.now() - started;
      const current = this.metrics.get(event.eventType) ?? { count: 0, failures: 0, totalDurationMs: 0, lastDurationMs: 0 };
      this.metrics.set(event.eventType, {
        count: current.count + 1,
        failures: current.failures + (failed ? 1 : 0),
        totalDurationMs: current.totalDurationMs + duration,
        lastDurationMs: duration,
      });
    }
  }

  snapshot(): Readonly<Record<string, EventMetric>> {
    return Object.freeze(Object.fromEntries([...this.metrics.entries()].map(([key, value]) => [key, { ...value }])));
  }
  reset(): void { this.metrics.clear(); }
}
