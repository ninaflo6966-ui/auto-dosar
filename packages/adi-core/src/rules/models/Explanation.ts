import type { RuleSeverity } from "../entities/RuleSeverity";

export interface ExplanationTemplate {
  title?: string;
  description?: string;
  reason?: string;
  passedDescription?: string;
  failedDescription?: string;
}

export interface Explanation {
  title: string;
  description: string;
  reason: string;
  severity: RuleSeverity;
  confidence: number;
  generatedAt: string;
}
