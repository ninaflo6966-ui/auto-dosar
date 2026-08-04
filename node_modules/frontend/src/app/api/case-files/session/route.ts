import { caseFileRuntime } from "@/lib/server/caseFileRuntime";
import type { OperationAnswers } from "@autodosar/adi-core/operations";
import { NextResponse } from "next/server";

interface SessionRequestBody {
  operationSlug?: string;
  answers?: OperationAnswers;
}

export async function POST(request: Request) {
  let body: SessionRequestBody;
  try {
    body = (await request.json()) as SessionRequestBody;
  } catch {
    return NextResponse.json({ message: "Corpul cererii nu este JSON valid." }, { status: 400 });
  }

  if (!body.operationSlug) {
    return NextResponse.json({ message: "operationSlug este obligatoriu." }, { status: 400 });
  }

  const operation = caseFileRuntime.operationRegistry.get(body.operationSlug);
  if (!operation || !operation.active) {
    return NextResponse.json({ message: "Operațiunea nu a fost găsită." }, { status: 404 });
  }

  const created = await caseFileRuntime.createCase.execute({
    operation: operation.type,
    operationSlug: operation.slug,
    answers: body.answers ?? {},
    source: "WEB",
  });

  const projection = await caseFileRuntime.updateAnswers.execute({
    caseId: created.caseId,
    answers: body.answers ?? {},
    expectedVersion: created.version,
  });

  return NextResponse.json({ caseFile: projection }, { status: 201 });
}
