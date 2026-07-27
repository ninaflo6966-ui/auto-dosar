import { CaseFile } from "../models/CaseFile";
import { DocumentSource } from "../../documents/enums/DocumentSource";
import { DocumentStatus } from "../../documents/enums/DocumentStatus";
import { DocumentType } from "../../documents/enums/DocumentType";

const caseFile: CaseFile = {
  id: "CASE-001",
  operation: "OWNERSHIP_TRANSFER",
  status: "DRAFT",

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
      createdAt: new Date(),
    },
  ],

  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log(JSON.stringify(caseFile, null, 2));