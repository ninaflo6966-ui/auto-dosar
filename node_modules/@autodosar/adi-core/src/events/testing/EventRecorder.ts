import type { DomainEvent } from "../contracts/DomainEvent";
import type { IEventBus } from "../contracts/IEventBus";

export class EventRecorder {
  private readonly recorded: DomainEvent[] = [];
  private unsubscribe?: () => void;

  start(bus: IEventBus): void {
    const subscription = bus.subscribe("*", (event) => { this.recorded.push(event); }, { handlerId: "EventRecorder", priority: -1000 });
    this.unsubscribe = () => subscription.unsubscribe();
  }
  stop(): void { this.unsubscribe?.(); this.unsubscribe = undefined; }
  events(): readonly DomainEvent[] { return [...this.recorded]; }
  clear(): void { this.recorded.length = 0; }
}
