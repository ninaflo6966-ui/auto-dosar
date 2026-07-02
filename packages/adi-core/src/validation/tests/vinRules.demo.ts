import { ValidationEngine } from "../engine/ValidationEngine";
import { validateVinConsistency } from "../rules/VinRules";

const issues = validateVinConsistency([
  {
    documentType: "CIV",
    vin: "VF1ABC12345678901",
  },
  {
    documentType: "Contract",
    vin: "VF1ABC12345678901",
  },
  {
    documentType: "RCA",
    vin: "VF1XYZ12345678901",
  },
]);

const engine = new ValidationEngine();
const result = engine.buildResult(issues);

console.log(JSON.stringify(result, null, 2));

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