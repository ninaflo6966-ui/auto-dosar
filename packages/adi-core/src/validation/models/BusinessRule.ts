import { ValidationIssue } from "./ValidationResult";

export type BusinessRuleSeverity = "info" | "warning" | "error";

export type BusinessRuleCategory =
  | "identity"
  | "vehicle"
  | "insurance"
  | "ownership"
  | "tax"
  | "documents"
  | "payment"
  | "representation";

export interface BusinessRuleContext {
  [key: string]: unknown;
}

export interface BusinessRule {
  id: string;
  title: string;
  description: string;
  category: BusinessRuleCategory;
  severity: BusinessRuleSeverity;
  legalReference?: string;
  userMessage: string;
  solution: string;
  execute(context: BusinessRuleContext): ValidationIssue[];
}
