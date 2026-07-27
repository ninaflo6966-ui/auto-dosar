import type { ISODateTime } from "../../domain/CoreDomain";
import type { TwinActor, TwinChangeSource } from "../models/DigitalTwin";
import type { TwinPatchOperation } from "../models/TwinPatch";

export interface TwinMutationEvent {
  eventId: string;
  caseId: string;
  expectedVersion: number;
  eventType: string;
  source: TwinChangeSource;
  actor: TwinActor;
  reason: string;
  occurredAt: ISODateTime;
  correlationId?: string;
  changes: TwinPatchOperation[];
}

export type TwinEventType =
  | "DOCUMENT_UPLOADED"
  | "OCR_COMPLETED"
  | "OWNER_UPDATED"
  | "VEHICLE_UPDATED"
  | "RULE_APPLIED"
  | "VALIDATION_COMPLETED"
  | "WORKFLOW_CHANGED"
  | "DOCUMENT_GENERATED"
  | "PAYMENT_UPDATED";
