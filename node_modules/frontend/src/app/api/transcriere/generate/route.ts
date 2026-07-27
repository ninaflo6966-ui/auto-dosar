import {
  DocumentGenerationEngine,
  OperationType,
  PersonType,
  type OwnershipDocumentMode,
} from "@autodosar/adi-core";
import { NextRequest, NextResponse } from "next/server";
import type { GenerateCaseRequest } from "@/types/generation";

const generationEngine = new DocumentGenerationEngine();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateCaseRequest;

    if (!body.sellerType || !body.ownershipMode) {
      return NextResponse.json(
        { error: "Datele operațiunii sunt incomplete." },
        { status: 400 }
      );
    }

    const result = generationEngine.generate({
      operation: OperationType.OwnershipTransfer,
      sellerType:
        body.sellerType === "PF"
          ? PersonType.Individual
          : PersonType.Company,
      ownershipMode: body.ownershipMode as OwnershipDocumentMode,
      availableDocumentTypes: body.documentTypes ?? [],
    });

    if (result.errors.length > 0) {
      return NextResponse.json(
        {
          ...result,
          error: result.errors[0],
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      ...result,
      sellerType: body.sellerType,
      ownershipMode: body.ownershipMode,
      documentTypes: body.documentTypes ?? [],
      receivedDocumentTypes: body.documentTypes ?? [],
      message:
        "Motorul AutoDosar a generat structura contractului, a dosarului fiscal și a dosarului DGPCI.",
    });
  } catch (error) {
    console.error("Generate transcription case error:", error);

    return NextResponse.json(
      { error: "Dosarul nu a putut fi generat." },
      { status: 500 }
    );
  }
}
