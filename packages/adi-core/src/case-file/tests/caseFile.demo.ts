import { CaseFile } from "../models/CaseFile";
import { CaseStatus } from "../../enums/CaseStatus";
import { OperationType } from "../../enums/OperationType";
import { DocumentSource } from "../../documents/enums/DocumentSource";
import { DocumentStatus } from "../../documents/enums/DocumentStatus";
import { DocumentType } from "../../documents/enums/DocumentType";

const now = new Date();

const caseFile: CaseFile = {
  id: "CASE-001",
  reference: "AD-2026-000001",
  operation: OperationType.OwnershipTransfer,
  status: CaseStatus.Draft,
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
      type: DocumentType.IdentityCard,
      status: DocumentStatus.Parsed,
      source: DocumentSource.ManualEntry,
      confidence: 1,
      createdAt: now,
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
  createdAt: now,
  updatedAt: now,
};

console.log(JSON.stringify(caseFile, null, 2));
