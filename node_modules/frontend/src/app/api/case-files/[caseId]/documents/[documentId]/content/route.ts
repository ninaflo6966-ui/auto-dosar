import { caseFileRuntime } from "@/lib/server/caseFileRuntime";
import { loadUploadedFile } from "@/lib/server/uploadStorage";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ caseId: string; documentId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { caseId, documentId } = await context.params;
  const current = await caseFileRuntime.repository.findById(caseId);
  const document = current?.documents.find((item) => item.id === documentId);
  if (!document?.storageKey) {
    return NextResponse.json({ message: "Fișierul nu a fost găsit." }, { status: 404 });
  }

  try {
    const content = await loadUploadedFile(document.storageKey);
    return new Response(new Uint8Array(content), {
      headers: {
        "Content-Type": document.mimeType ?? "application/octet-stream",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(document.originalFileName ?? "document")}`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "Fișierul nu mai este disponibil." }, { status: 404 });
  }
}
