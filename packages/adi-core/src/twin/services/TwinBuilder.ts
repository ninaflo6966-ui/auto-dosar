import type { DomainCase, DomainOperation, DomainParty, DomainVehicle } from "../../domain/CoreDomain";
import type { DigitalCaseTwin, TwinChangeContext } from "../models/DigitalTwin";
import { deepFreeze } from "../utils/objectTools";

export interface CreateTwinInput {
  case: DomainCase;
  operation: DomainOperation;
  parties?: DomainParty[];
  vehicle?: DomainVehicle;
  context?: Partial<TwinChangeContext>;
}

export class TwinBuilder {
  constructor(private readonly now: () => Date = () => new Date(), private readonly idFactory: () => string = defaultId) {}

  create(input: CreateTwinInput): DigitalCaseTwin {
    if (input.case.operationId !== input.operation.id) {
      throw new Error("Operațiunea primită nu corespunde operațiunii asociate dosarului.");
    }
    const timestamp = this.now().toISOString();
    const actor = input.context?.actor ?? { type: "SYSTEM" as const };
    const source = input.context?.source ?? "SYSTEM";
    const reason = input.context?.reason ?? "Inițializare Digital Twin";
    const twinId = this.idFactory();

    const twin: DigitalCaseTwin = {
      id: twinId,
      caseId: input.case.id,
      version: 1,
      case: { ...input.case },
      operation: { ...input.operation, options: { ...input.operation.options } },
      vehicle: input.vehicle ? { ...input.vehicle } : undefined,
      parties: [...(input.parties ?? [])],
      documents: [],
      payments: [],
      validations: [],
      completenessScore: 0,
      readyForSubmission: false,
      createdAt: timestamp,
      updatedAt: timestamp,
      metadata: {
        schemaVersion: "1.0",
        lastChangeSource: source,
        lastChangeReason: reason,
        lastActor: actor,
        correlationId: input.context?.correlationId,
        updatedAt: timestamp,
      },
      auditTrail: [{
        id: this.idFactory(),
        caseId: input.case.id,
        eventType: "TWIN_CREATED",
        actorType: actor.type,
        actorId: actor.id,
        occurredAt: timestamp,
        payload: { twinId, version: 1, source, reason },
      }],
    };
    return deepFreeze(twin);
  }
}

function defaultId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `twin-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
