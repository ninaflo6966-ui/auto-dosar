import { NextRequest, NextResponse } from "next/server";
import { IdentityService } from "../../../../lib/adi-core/identity/services/IdentityService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rawText = typeof body.rawText === "string" ? body.rawText : "";

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Textul OCR este gol." },
        { status: 400 }
      );
    }

    const identityService = new IdentityService();
    const result = identityService.analyzeRawText(rawText);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Identity analysis error:", error);

    return NextResponse.json(
      { error: "A apărut o eroare la analiza identității." },
      { status: 500 }
    );
  }
}