import {
  ValidationIssue,
  ValidationResult,
} from "../models/ValidationResult";

export class ValidationEngine {
  buildResult(issues: ValidationIssue[]): ValidationResult {
    const errors = issues.filter((issue) => issue.severity === "error");
    const warnings = issues.filter((issue) => issue.severity === "warning");

    return {
      isValid: errors.length === 0,
      score: this.calculateScore(errors.length, warnings.length),
      issues,
    };
  }

  private calculateScore(errorCount: number, warningCount: number): number {
    let score = 1;

    score -= errorCount * 0.25;
    score -= warningCount * 0.1;

    return Math.max(0, Math.round(score * 100) / 100);
  }
}