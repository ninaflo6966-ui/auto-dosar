import { IdentityCard } from "../models/IdentityCard";

export interface IdentityValidationIssue {
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface IdentityValidationResult {
  isValid: boolean;
  errors: IdentityValidationIssue[];
  warnings: IdentityValidationIssue[];
  score: number;
}

export class IdentityValidator {
  validate(identityCard: IdentityCard): IdentityValidationResult {
    const errors: IdentityValidationIssue[] = [];
    const warnings: IdentityValidationIssue[] = [];

    if (!identityCard.cnp) {
      errors.push({
        field: "cnp",
        message: "CNP-ul nu a fost identificat.",
        severity: "error",
      });
    } else if (!this.isValidCnp(identityCard.cnp)) {
      errors.push({
        field: "cnp",
        message: "CNP-ul identificat nu este valid.",
        severity: "error",
      });
    }

    if (!identityCard.series) {
      errors.push({
        field: "series",
        message: "Seria actului de identitate nu a fost identificată.",
        severity: "error",
      });
    } else if (!/^[A-Z]{2}$/.test(identityCard.series)) {
      errors.push({
        field: "series",
        message: "Seria actului de identitate trebuie să conțină două litere.",
        severity: "error",
      });
    }

    if (!identityCard.number) {
      errors.push({
        field: "number",
        message: "Numărul actului de identitate nu a fost identificat.",
        severity: "error",
      });
    } else if (!/^\d{6}$/.test(identityCard.number)) {
      errors.push({
        field: "number",
        message: "Numărul actului de identitate trebuie să conțină șase cifre.",
        severity: "error",
      });
    }

    if (!identityCard.lastName) {
      errors.push({
        field: "lastName",
        message: "Numele nu a fost identificat.",
        severity: "error",
      });
    }

    if (!identityCard.firstName) {
      errors.push({
        field: "firstName",
        message: "Prenumele nu a fost identificat.",
        severity: "error",
      });
    }

    if (!identityCard.address) {
      warnings.push({
        field: "address",
        message:
          "Adresa nu a fost identificată. Poate fi necesară completarea manuală.",
        severity: "warning",
      });
    }

    if (!identityCard.issuingAuthority) {
      warnings.push({
        field: "issuingAuthority",
        message:
          "Autoritatea emitentă nu a fost identificată. Poate fi necesară verificarea manuală.",
        severity: "warning",
      });
    }

    if (
      identityCard.confidence !== undefined &&
      identityCard.confidence < 0.7
    ) {
      warnings.push({
        field: "confidence",
        message:
          "Nivelul de încredere al extragerii este scăzut. Documentul trebuie verificat manual.",
        severity: "warning",
      });
    }

    const score = this.calculateScore(errors.length, warnings.length);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
    };
  }

  private isValidCnp(cnp: string): boolean {
    if (!/^[1-9]\d{12}$/.test(cnp)) {
      return false;
    }

    if (!this.hasValidBirthDate(cnp)) {
      return false;
    }

    const controlKey = "279146358279";
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      sum += Number(cnp[i]) * Number(controlKey[i]);
    }

    const remainder = sum % 11;
    const controlDigit = remainder === 10 ? 1 : remainder;

    return controlDigit === Number(cnp[12]);
  }

  private hasValidBirthDate(cnp: string): boolean {
    const sexAndCentury = Number(cnp[0]);
    const year = Number(cnp.substring(1, 3));
    const month = Number(cnp.substring(3, 5));
    const day = Number(cnp.substring(5, 7));

    let fullYear: number;

    if (sexAndCentury === 1 || sexAndCentury === 2) {
      fullYear = 1900 + year;
    } else if (sexAndCentury === 3 || sexAndCentury === 4) {
      fullYear = 1800 + year;
    } else if (sexAndCentury === 5 || sexAndCentury === 6) {
      fullYear = 2000 + year;
    } else {
      fullYear = 1900 + year;
    }

    const date = new Date(fullYear, month - 1, day);

    return (
      date.getFullYear() === fullYear &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  private calculateScore(errorCount: number, warningCount: number): number {
    let score = 1;

    score -= errorCount * 0.25;
    score -= warningCount * 0.1;

    return Math.max(0, Math.round(score * 100) / 100);
  }
}