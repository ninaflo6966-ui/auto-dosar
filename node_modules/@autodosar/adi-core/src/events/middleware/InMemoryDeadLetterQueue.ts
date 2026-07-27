import type { DeadLetterQueue, EventFailure } from "../contracts/EventFailure";

export class InMemoryDeadLetterQueue implements DeadLetterQueue {
  private failures: EventFailure[] = [];
  add(failure: EventFailure): void { this.failures.push(Object.freeze({ ...failure })); }
  list(): readonly EventFailure[] { return [...this.failures]; }
  clear(): void { this.failures = []; }
}
