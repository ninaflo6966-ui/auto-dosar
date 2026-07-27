import { ValidationIssue } from "../models/ValidationResult";

export interface VinDocumentReference {
  documentType: string;
  vin?: string;
}

export function validateVinConsistency(
  documents: VinDocumentReference[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const documentsWithVin = documents.filter(
    (document) => document.vin && document.vin.trim()
  );

  if (documentsWithVin.length <= 1) {
    return issues;
  }

  const referenceVin = normalizeVin(documentsWithVin[0].vin || "");

  for (const document of documentsWithVin) {
    const currentVin = normalizeVin(document.vin || "");

    if (currentVin !== referenceVin) {
      issues.push({
        code: "VIN_MISMATCH",
        field: "vin",
        message: `VIN-ul din documentul ${document.documentType} nu coincide cu VIN-ul principal al dosarului.`,
        severity: "error",
      });
    }
  }

  return issues;
}

export function validateVinFormat(
  vin?: string,
  field = "vin"
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!vin || !vin.trim()) {
    issues.push({
      code: "VIN_MISSING",
      field,
      message: "VIN-ul lipsește.",
      severity: "error",
    });

    return issues;
  }

  const normalizedVin = normalizeVin(vin);

  if (normalizedVin.length !== 17) {
    issues.push({
      code: "VIN_INVALID_LENGTH",
      field,
      message: "VIN-ul trebuie să conțină 17 caractere.",
      severity: "error",
    });
  }

  if (/[IOQ]/.test(normalizedVin)) {
    issues.push({
      code: "VIN_INVALID_CHARACTERS",
      field,
      message: "VIN-ul nu trebuie să conțină literele I, O sau Q.",
      severity: "error",
    });
  }

  return issues;
}

function normalizeVin(value: string): string {
  return value
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");
}