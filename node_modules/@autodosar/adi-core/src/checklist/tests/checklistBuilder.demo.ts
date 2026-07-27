import { ChecklistBuilder } from "../builders/ChecklistBuilder";
import { CaseStatus } from "../../enums/CaseStatus";
import { OperationType } from "../../enums/OperationType";
import { DocumentType } from "../../documents/enums/DocumentType";
import { DocumentStatus } from "../../documents/enums/DocumentStatus";
import { DocumentSource } from "../../documents/enums/DocumentSource";

const caseFile = {
  id: "CASE-001",
  reference: "AD-2026-000001",
  operation: OperationType.OwnershipTransfer,
  status: CaseStatus.Validation,

  persons: [
    {
      firstName: "ION",
      lastName: "POPESCU",
      cnp: "1900512123451",
    },
  ],
  companies: [],

  vehicles: [
    {
      id: "VEH-001",
      vin: "VF1ABC12345678901",
      brand: "DACIA",
      model: "LOGAN",
    },
  ],

  documents: [
    {
      id: "DOC-001",
      type: DocumentType.CIV,
      status: DocumentStatus.Parsed,
      source: DocumentSource.ManualEntry,
      confidence: 1,
      createdAt: new Date(),
    },
  ],

  progress: {
    completedSteps: 0,
    totalSteps: 0,
    percent: 0,
    missingDocuments: [],
    blockingErrors: [],
  },

  timeline: [],

  validation: {
    isValid: false,
    score: 0.75,
    issues: [
      {
        code: "RCA_NOT_ON_BUYER",
        field: "rca.ownerName",
        message: "RCA nu este emisă pe numele cumpărătorului.",
        severity: "error" as const,
      },
    ],
  },

  createdAt: new Date(),
  updatedAt: new Date(),
};

const builder = new ChecklistBuilder();
const result = builder.build(caseFile);

console.log(JSON.stringify(result, null, 2));