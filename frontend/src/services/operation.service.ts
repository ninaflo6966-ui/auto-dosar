import type { OperationDefinition } from "@autodosar/adi-core/operations";

export type OperationSummary = Omit<OperationDefinition, "questions" | "documents"> & {
  questionCount: number;
  documentCount: number;
};

interface OperationsResponse {
  operations: OperationSummary[];
}

interface OperationResponse {
  operation: OperationDefinition;
}

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Nu am putut încărca datele operațiunii.");
  }
  return response.json() as Promise<T>;
}

export async function listOperations(signal?: AbortSignal): Promise<OperationSummary[]> {
  const response = await fetch("/api/operations", { signal, cache: "no-store" });
  return (await readJson<OperationsResponse>(response)).operations;
}

export async function getOperation(
  slug: string,
  signal?: AbortSignal,
): Promise<OperationDefinition> {
  const response = await fetch(`/api/operations/${encodeURIComponent(slug)}`, {
    signal,
    cache: "no-store",
  });
  return (await readJson<OperationResponse>(response)).operation;
}
