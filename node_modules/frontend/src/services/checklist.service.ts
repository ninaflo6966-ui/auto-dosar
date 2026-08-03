import type { SmartChecklistResult } from "@autodosar/adi-core";
import type { OperationAnswers } from "@autodosar/adi-core/operations";

interface ChecklistResponse {
  checklist: SmartChecklistResult;
}

interface GenerateChecklistInput {
  answers: OperationAnswers;
  uploadedDocumentIds?: string[];
  validatedDocumentIds?: string[];
}

export async function generateChecklist(
  operationSlug: string,
  input: GenerateChecklistInput,
  signal?: AbortSignal,
): Promise<SmartChecklistResult> {
  const response = await fetch(
    `/api/operations/${encodeURIComponent(operationSlug)}/checklist`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal,
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Checklist-ul nu a putut fi generat.");
  }

  return ((await response.json()) as ChecklistResponse).checklist;
}
