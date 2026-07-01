import { ValidationIssue } from "../models/ValidationResult";

export interface RcaPolicy {
  ownerName?: string;
  vin?: string;
  registrationNumber?: string;
  validFrom?: string;
  validUntil?: string;
}

export interface RcaValidationInput {
  buyerName?: string;
  vehicleVin?: string;
  vehicleRegistrationNumber?: string;
  rca?: RcaPolicy;
  checkDate: string;
}

export function validateRcaForBuyer(
  input: RcaValidationInput
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!input.rca) {
    issues.push({
      code: "RCA_MISSING",
      field: "rca",
      message: "Lipsește polița RCA.",
      severity: "error",
    });

    return issues;
  }

  if (
    input.rca.ownerName &&
    input.buyerName &&
    normalize(input.rca.ownerName) !== normalize(input.buyerName)
  ) {
    issues.push({
      code: "RCA_NOT_ON_BUYER",
      field: "rca.ownerName",
      message: "RCA nu este emisă pe numele cumpărătorului.",
      severity: "error",
    });
  }

  if (
    input.rca.vin &&
    input.vehicleVin &&
    normalize(input.rca.vin) !== normalize(input.vehicleVin)
  ) {
    issues.push({
      code: "RCA_VIN_MISMATCH",
      field: "rca.vin",
      message: "VIN-ul din RCA nu coincide cu VIN-ul vehiculului din dosar.",
      severity: "error",
    });
  }

  if (
    input.rca.registrationNumber &&
    input.vehicleRegistrationNumber &&
    normalize(input.rca.registrationNumber) !==
      normalize(input.vehicleRegistrationNumber)
  ) {
    issues.push({
      code: "RCA_REGISTRATION_NUMBER_MISMATCH",
      field: "rca.registrationNumber",
      message:
        "Numărul de înmatriculare din RCA nu coincide cu numărul vehiculului din dosar.",
      severity: "error",
    });
  }

  if (
    input.rca.validFrom &&
    input.rca.validUntil &&
    !isDateWithinInterval(input.checkDate, input.rca.validFrom, input.rca.validUntil)
  ) {
    issues.push({
      code: "RCA_NOT_VALID_AT_CHECK_DATE",
      field: "rca.validUntil",
      message: "RCA nu este valabilă la data verificării.",
      severity: "error",
    });
  }

  return issues;
}

function normalize(value: string): string {
  return value
    .toUpperCase()
    .replace(/\s+/g, " ")
    .replace(/[^\wĂÂÎȘŞȚŢ -]/g, "")
    .trim();
}

function isDateWithinInterval(
  date: string,
  validFrom: string,
  validUntil: string
): boolean {
  const d = new Date(date);
  const from = new Date(validFrom);
  const until = new Date(validUntil);

  return d >= from && d <= until;
}