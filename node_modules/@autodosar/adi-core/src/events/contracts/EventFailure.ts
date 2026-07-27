import type { DomainEvent } from "./DomainEvent";

export interface EventFailure {
  readonly event: DomainEvent;
  readonly handlerId: string;
  readonly attempts: number;
  readonly failedAt: string;
  readonly errorName: string;
  readonly errorMessage: string;
}

export interface DeadLetterQueue {
  add(failure: EventFailure): void | Promise<void>;
  list(): readonly EventFailure[] | Promise<readonly EventFailure[]>;
  clear(): void | Promise<void>;
}
