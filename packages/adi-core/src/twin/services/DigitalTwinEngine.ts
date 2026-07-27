import type { CreateTwinInput } from "./TwinBuilder";
import { TwinBuilder } from "./TwinBuilder";
import { TwinUpdater } from "./TwinUpdater";
import type { ITwinRepository } from "../repository/ITwinRepository";
import type { TwinMutationEvent } from "../events/TwinEvents";
import type { DigitalCaseTwin } from "../models/DigitalTwin";

export class DigitalTwinEngine {
  constructor(
    private readonly repository: ITwinRepository,
    private readonly builder = new TwinBuilder(),
    private readonly updater = new TwinUpdater(),
  ) {}

  async create(input: CreateTwinInput): Promise<DigitalCaseTwin> {
    const existing = await this.repository.getCurrent(input.case.id);
    if (existing) throw new Error(`Dosarul ${input.case.id} are deja un Digital Twin.`);
    const twin = this.builder.create(input);
    await this.repository.save(twin);
    return twin;
  }

  async applyEvent(event: TwinMutationEvent): Promise<DigitalCaseTwin> {
    const current = await this.repository.getCurrent(event.caseId);
    if (!current) throw new Error(`Digital Twin inexistent pentru dosarul ${event.caseId}.`);
    const result = this.updater.apply(current, {
      expectedVersion: event.expectedVersion,
      changes: event.changes,
      context: {
        actor: event.actor,
        source: event.source,
        reason: event.reason,
        correlationId: event.correlationId,
        occurredAt: event.occurredAt,
      },
    });
    await this.repository.save(result.current);
    return result.current;
  }
}
