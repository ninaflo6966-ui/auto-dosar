export type CaseFileEventType =
  | "CASE_FILE_CREATED"
  | "CASE_FILE_ANSWERS_UPDATED"
  | "CASE_FILE_CHECKLIST_UPDATED"
  | "CASE_FILE_DOCUMENT_ADDED"
  | "CASE_FILE_DOCUMENT_REMOVED"
  | "CASE_FILE_STATUS_CHANGED";

export interface CaseFileEvent {
  id: string;
  caseFileId: string;
  type: CaseFileEventType;
  occurredAt: Date;
  actor: "SYSTEM" | "USER" | "ADMIN" | "INTEGRATION";
  payload?: Record<string, unknown>;
}
