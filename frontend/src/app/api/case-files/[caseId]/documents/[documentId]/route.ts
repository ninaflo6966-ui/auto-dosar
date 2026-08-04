import { caseFileRuntime } from "@/lib/server/caseFileRuntime";
import { deleteUploadedFile } from "@/lib/server/uploadStorage";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ caseId: string; documentId: string }>;
}

export async function DELETE(request: Request, context: RouteContext) {
  const { caseId, documentId } = await context.params;
  const current = await caseFileRuntime.repository.findById(caseId);
  const document = current?.documents.find((item) => item.id === documentId);
  if (!current || !document) {
    return NextResponse.json({ message: "Documentul nu a fost găsit." }, { status: 404 });
  }

  const expectedVersionHeader = request.headers.get("x-case-version");
  try {
    const projection = await caseFileRuntime.removeDocument.execute({
      caseId,
      documentId,
      expectedVersion: expectedVersionHeader ? Number(expectedVersionHeader) : undefined,
    });
    await deleteUploadedFile(document.storageKey);
    return NextResponse.json({ caseFile: projection });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Documentul nu a putut fi șters." },
      { status: 400 },
    );
  }
}
