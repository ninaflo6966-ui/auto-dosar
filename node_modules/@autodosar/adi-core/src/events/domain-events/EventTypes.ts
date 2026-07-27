export const EventTypes = {
  CASE_CREATED: "case.created",
  DOCUMENT_UPLOADED: "document.uploaded",
  DOCUMENT_CLASSIFIED: "document.classified",
  OCR_COMPLETED: "ocr.completed",
  TWIN_CREATED: "twin.created",
  TWIN_UPDATED: "twin.updated",
  KNOWLEDGE_RESOLVED: "knowledge.resolved",
  RULE_EVALUATION_REQUESTED: "rules.evaluation.requested",
  RULE_EVALUATION_COMPLETED: "rules.evaluation.completed",
  VALIDATION_COMPLETED: "validation.completed",
  WORKFLOW_CHANGED: "workflow.changed",
  DOCUMENT_GENERATED: "document.generated",
  PAYMENT_REGISTERED: "payment.registered",
  APPOINTMENT_CREATED: "appointment.created",
  NOTIFICATION_REQUESTED: "notification.requested",
} as const;

export type EventType = typeof EventTypes[keyof typeof EventTypes];
