import {
  createDefaultOperationRegistry,
  type OperationAnswers,
} from "@autodosar/adi-core/operations";
import { SmartChecklistEngine } from "@autodosar/adi-core";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

interface ChecklistRequestBody {
  answers?: OperationAnswers;
  uploadedDocumentIds?: string[];
  validatedDocumentIds?: string[];
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const registry = createDefaultOperationRegistry();
  const operation = registry.get(slug);

  if (!operation || !operation.active) {
    return NextResponse.json(
      { message: `Operațiunea „${slug}” nu a fost găsită.` },
      { status: 404 },
    );
  }

  let body: ChecklistRequestBody;
  try {
    body = (await request.json()) as ChecklistRequestBody;
  } catch {
    return NextResponse.json(
      { message: "Corpul cererii nu este JSON valid." },
      { status: 400 },
    );
  }

  const checklist = new SmartChecklistEngine().build({
    operation,
    answers: body.answers ?? {},
    uploadedDocumentIds: body.uploadedDocumentIds ?? [],
    validatedDocumentIds: body.validatedDocumentIds ?? [],
  });

  return NextResponse.json({ checklist });
}
