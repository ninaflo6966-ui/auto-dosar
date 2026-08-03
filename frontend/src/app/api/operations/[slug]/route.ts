import { createDefaultOperationRegistry } from "@autodosar/adi-core/operations";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const registry = createDefaultOperationRegistry();
  const operation = registry.get(slug);

  if (!operation || !operation.active) {
    return NextResponse.json(
      { message: `Operațiunea „${slug}” nu a fost găsită.` },
      { status: 404 },
    );
  }

  return NextResponse.json({ operation });
}
