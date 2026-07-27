import { createDomainEvent, type DomainEvent, type DomainEventInput } from "../contracts/DomainEvent";
import { EventTypes } from "./EventTypes";

export interface DocumentUploadedPayload { documentId: string; fileName: string; mimeType: string; sizeBytes: number; documentType?: string; }
export interface OcrCompletedPayload { documentId: string; confidence: number; extractedFields: Readonly<Record<string, unknown>>; }
export interface TwinUpdatedPayload { twinId: string; previousVersion: number; currentVersion: number; changedPaths: readonly string[]; }
export interface KnowledgeResolvedPayload { operationId: string; knowledgePackageId: string; knowledgeVersion: string; requirementIds: readonly string[]; }
export interface RuleEvaluationRequestedPayload { twinId: string; twinVersion: number; changedPaths?: readonly string[]; }
export interface RuleEvaluationCompletedPayload { twinId: string; twinVersion: number; passed: number; warnings: number; failed: number; resultIds: readonly string[]; }
export interface ValidationCompletedPayload { status: "PASS" | "WARNING" | "FAIL"; issueIds: readonly string[]; }
export interface WorkflowChangedPayload { previousState: string; currentState: string; reason: string; }
export interface DocumentGeneratedPayload { generatedDocumentId: string; templateId: string; outputFormat: string; }
export interface PaymentRegisteredPayload { paymentId: string; amount: number; currency: string; status: string; }
export interface AppointmentCreatedPayload { appointmentId: string; institutionId: string; scheduledAt: string; }
export interface NotificationRequestedPayload { channel: string; recipientId: string; templateId: string; }

export type EventFactoryInput<T> = Omit<DomainEventInput<T>, "eventType" | "aggregateType">;

function factory<T>(eventType: string, aggregateType: string, input: EventFactoryInput<T>): DomainEvent<T> {
  return createDomainEvent({ ...input, eventType, aggregateType });
}

export const AutoDosarEvents = {
  documentUploaded: (input: EventFactoryInput<DocumentUploadedPayload>) => factory(EventTypes.DOCUMENT_UPLOADED, "Case", input),
  ocrCompleted: (input: EventFactoryInput<OcrCompletedPayload>) => factory(EventTypes.OCR_COMPLETED, "Case", input),
  twinUpdated: (input: EventFactoryInput<TwinUpdatedPayload>) => factory(EventTypes.TWIN_UPDATED, "DigitalTwin", input),
  knowledgeResolved: (input: EventFactoryInput<KnowledgeResolvedPayload>) => factory(EventTypes.KNOWLEDGE_RESOLVED, "Case", input),
  ruleEvaluationRequested: (input: EventFactoryInput<RuleEvaluationRequestedPayload>) => factory(EventTypes.RULE_EVALUATION_REQUESTED, "DigitalTwin", input),
  ruleEvaluationCompleted: (input: EventFactoryInput<RuleEvaluationCompletedPayload>) => factory(EventTypes.RULE_EVALUATION_COMPLETED, "DigitalTwin", input),
  validationCompleted: (input: EventFactoryInput<ValidationCompletedPayload>) => factory(EventTypes.VALIDATION_COMPLETED, "Case", input),
  workflowChanged: (input: EventFactoryInput<WorkflowChangedPayload>) => factory(EventTypes.WORKFLOW_CHANGED, "Case", input),
  documentGenerated: (input: EventFactoryInput<DocumentGeneratedPayload>) => factory(EventTypes.DOCUMENT_GENERATED, "Case", input),
  paymentRegistered: (input: EventFactoryInput<PaymentRegisteredPayload>) => factory(EventTypes.PAYMENT_REGISTERED, "Case", input),
  appointmentCreated: (input: EventFactoryInput<AppointmentCreatedPayload>) => factory(EventTypes.APPOINTMENT_CREATED, "Case", input),
  notificationRequested: (input: EventFactoryInput<NotificationRequestedPayload>) => factory(EventTypes.NOTIFICATION_REQUESTED, "Case", input),
};
