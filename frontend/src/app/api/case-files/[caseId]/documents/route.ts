import { caseFileRuntime } from "@/lib/server/caseFileRuntime";
import { mapChecklistDocumentType } from "@/lib/server/documentTypeMap";
import { deleteUploadedFile, saveUploadedFile } from "@/lib/server/uploadStorage";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ caseId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const { caseId } = await context.params;
  const form = await request.formData();
  const file = form.get("file");
  const checklistDocumentId = String(form.get("checklistDocumentId") ?? "");
  const expectedVersionRaw = form.get("expectedVersion");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Fișierul este obligatoriu." }, { status: 400 });
  }
  if (!checklistDocumentId) {
    return NextResponse.json({ message: "checklistDocumentId este obligatoriu." }, { status: 400 });
  }

  const current = await caseFileRuntime.repository.findById(caseId);
  if (!current) return NextResponse.json({ message: "Dosarul nu a fost găsit." }, { status: 404 });
  const previous = current.documents.filter((item) => item.operationDocumentId === checklistDocumentId);

  const temporaryDocumentId = crypto.randomUUID();
  const storageKey = await saveUploadedFile(caseId, temporaryDocumentId, file);

  try {
    const projection = await caseFileRuntime.uploadDocument.execute({
      caseId,
      checklistDocumentId,
      documentType: mapChecklistDocumentType(checklistDocumentId),
      fileName: file.name,
      mimeType: file.type || inferMimeType(file.name),
      sizeBytes: file.size,
      storageKey,
      expectedVersion: expectedVersionRaw ? Number(expectedVersionRaw) : undefined,
    });

    await Promise.all(previous.map((item) => deleteUploadedFile(item.storageKey)));
    return NextResponse.json({ caseFile: projection });
  } catch (error) {
    await deleteUploadedFile(storageKey);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Documentul nu a putut fi încărcat." },
      { status: 400 },
    );
  }
}

function inferMimeType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  return "image/jpeg";
}
