import type { OperationAnswers } from "@autodosar/adi-core/operations";

export interface UiCaseDocument {
  id: string;
  checklistDocumentId?: string;
  status: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface UiCaseProjection {
  caseId: string;
  reference: string;
  score: number;
  version: number;
  operationSlug?: string;
  checklist?: import("@autodosar/adi-core").SmartChecklistResult;
  documents?: UiCaseDocument[];
}

interface ProjectionResponse {
  caseFile: UiCaseProjection;
}

export async function createCaseSession(operationSlug: string, answers: OperationAnswers): Promise<UiCaseProjection> {
  const response = await fetch("/api/case-files/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operationSlug, answers }),
  });
  return readProjection(response);
}

export async function uploadCaseDocument(input: {
  caseId: string;
  checklistDocumentId: string;
  file: File;
  expectedVersion: number;
}): Promise<UiCaseProjection> {
  const body = new FormData();
  body.set("file", input.file);
  body.set("checklistDocumentId", input.checklistDocumentId);
  body.set("expectedVersion", String(input.expectedVersion));
  const response = await fetch(`/api/case-files/${encodeURIComponent(input.caseId)}/documents`, {
    method: "POST",
    body,
  });
  return readProjection(response);
}

export async function removeCaseDocument(input: {
  caseId: string;
  documentId: string;
  expectedVersion: number;
}): Promise<UiCaseProjection> {
  const response = await fetch(
    `/api/case-files/${encodeURIComponent(input.caseId)}/documents/${encodeURIComponent(input.documentId)}`,
    { method: "DELETE", headers: { "x-case-version": String(input.expectedVersion) } },
  );
  return readProjection(response);
}

async function readProjection(response: Response): Promise<UiCaseProjection> {
  const payload = (await response.json().catch(() => null)) as (ProjectionResponse & { message?: string }) | null;
  if (!response.ok || !payload?.caseFile) throw new Error(payload?.message ?? "Operațiunea nu a putut fi finalizată.");
  return payload.caseFile;
}
