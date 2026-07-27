import { NextRequest, NextResponse } from "next/server";
import {
  CaseOrchestrator,
  CaseStatus,
  DocumentSource,
  DocumentStatus,
  DocumentType,
  OperationType,
} from "@autodosar/adi-core";

interface StateRequestBody {
  documentTypes?: string[];
  sellerType?: "PF" | "PJ";
  ownershipMode?: "EXISTING" | "GENERATE";
}

const supportedDocumentTypes = new Set<string>(
  Object.values(DocumentType)
);

function parseDocumentTypes(values: string[]): DocumentType[] {
  return values.filter((value) =>
    supportedDocumentTypes.has(value)
  ) as DocumentType[];
}

function buildCaseFile(documentTypes: DocumentType[]) {
  const documents = documentTypes.map((type, index) => ({
    id: `DOC-${index + 1}`,
    type,
    status: DocumentStatus.Parsed,
    source: DocumentSource.Upload,
    confidence: 0.95,
    createdAt: new Date(),
  }));

  const hasBuyerIdentity =
    documentTypes.includes(DocumentType.IdentityCard) ||
    documentTypes.includes(DocumentType.ElectronicIdentityCardFront);

  const hasVehicleDocument =
    documentTypes.includes(DocumentType.CIV) ||
    documentTypes.includes(DocumentType.RegistrationCertificate);

  const hasRca = documentTypes.includes(DocumentType.RCA);

  const validationIssues = [];

  if (!hasRca) {
    validationIssues.push({
      code: "RCA_MISSING",
      field: "rca",
      message: "Lipsește polița RCA.",
      severity: "error" as const,
    });
  }

  return {
    id: "CASE-001",
    reference: "AD-2026-000001",
    operation: OperationType.OwnershipTransfer,
    status: CaseStatus.Validation,

    persons: hasBuyerIdentity
      ? [
          {
            firstName: "CUMPĂRĂTOR",
            lastName: "IDENTIFICAT",
          },
        ]
      : [],

    companies: [],

    vehicles: hasVehicleDocument
      ? [
          {
            id: "VEH-001",
            vin: "VIN-DEMO-IDENTIFICAT",
          },
        ]
      : [],

    documents,

    progress: {
      completedSteps: 0,
      totalSteps: 0,
      percent: 0,
      missingDocuments: [],
      blockingErrors: [],
    },

    timeline: [],

    validation: {
      isValid: validationIssues.length === 0,
      score: validationIssues.length === 0 ? 1 : 0.75,
      issues: validationIssues,
    },

    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function calculateState(documentTypes: DocumentType[]) {
  const caseFile = buildCaseFile(documentTypes);
  const orchestrator = new CaseOrchestrator();

  return orchestrator.getState(caseFile);
}

export async function GET() {
  return NextResponse.json(calculateState([]));
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as StateRequestBody;

    const documentTypes = parseDocumentTypes(
      Array.isArray(body.documentTypes) ? body.documentTypes : []
    );

    const state = calculateState(documentTypes);

    return NextResponse.json(state);
  } catch (error) {
    console.error("Transcriere state error:", error);

    return NextResponse.json(
      {
        error: "Starea dosarului nu a putut fi recalculată.",
      },
      { status: 500 }
    );
  }
}