import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const uploadRoot = path.join(process.cwd(), ".autodosar", "uploads");

export async function saveUploadedFile(caseId: string, documentId: string, file: File): Promise<string> {
  const directory = path.join(uploadRoot, safe(caseId));
  await mkdir(directory, { recursive: true });
  const extension = path.extname(file.name).slice(0, 12);
  const storageKey = path.join(directory, `${safe(documentId)}${extension}`);
  await writeFile(storageKey, Buffer.from(await file.arrayBuffer()));
  return storageKey;
}

export async function loadUploadedFile(storageKey: string): Promise<Buffer> {
  assertStorageKey(storageKey);
  return readFile(storageKey);
}

export async function deleteUploadedFile(storageKey?: string): Promise<void> {
  if (!storageKey) return;
  assertStorageKey(storageKey);
  await unlink(storageKey).catch(() => undefined);
}

function assertStorageKey(storageKey: string): void {
  const resolved = path.resolve(storageKey);
  const root = path.resolve(uploadRoot);
  if (!resolved.startsWith(root + path.sep)) throw new Error("Invalid upload storage key.");
}

function safe(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}
