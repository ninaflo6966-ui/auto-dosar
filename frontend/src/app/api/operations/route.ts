import { createDefaultOperationRegistry } from "@autodosar/adi-core/operations";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  const registry = createDefaultOperationRegistry();
  const operations = registry.list().map(({ questions, documents, ...summary }) => ({
    ...summary,
    questionCount: questions.length,
    documentCount: documents.length,
  }));

  return NextResponse.json({ operations });
}
