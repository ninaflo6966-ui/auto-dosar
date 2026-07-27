import type {
  DomainAuditEvent,
  DomainCaseTwin,
  EntityId,
  ISODateTime,
} from "../../domain/CoreDomain";

export type TwinActorType = "USER" | "SYSTEM" | "INTEGRATION" | "ADMIN";
export type TwinChangeSource = "USER_INPUT" | "OCR" | "RULE_ENGINE" | "WORKFLOW" | "DOCUMENT_ENGINE" | "INTEGRATION" | "SYSTEM";

export interface TwinActor {
  type: TwinActorType;
  id?: EntityId;
}

export interface TwinChangeContext {
  actor: TwinActor;
  source: TwinChangeSource;
  reason: string;
  correlationId?: string;
  occurredAt?: ISODateTime;
}

export interface TwinMetadata {
  schemaVersion: "1.0";
  lastChangeSource: TwinChangeSource;
  lastChangeReason: string;
  lastActor: TwinActor;
  correlationId?: string;
  updatedAt: ISODateTime;
}

export interface DigitalCaseTwin extends DomainCaseTwin {
  id: EntityId;
  updatedAt: ISODateTime;
  metadata: TwinMetadata;
  auditTrail: DomainAuditEvent[];
}

export interface TwinSnapshot {
  twinId: EntityId;
  caseId: EntityId;
  version: number;
  createdAt: ISODateTime;
  checksum: string;
  twin: DigitalCaseTwin;
}

export interface TwinVersionSummary {
  twinId: EntityId;
  caseId: EntityId;
  version: number;
  createdAt: ISODateTime;
  source: TwinChangeSource;
  reason: string;
  actor: TwinActor;
}
