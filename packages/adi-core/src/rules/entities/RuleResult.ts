import type { LegalReference } from "../../knowledge";
import type { RuleCategory } from "./RuleCategory";
import type { RuleSeverity } from "./RuleSeverity";
import type { RuleOutcome } from "./RuleStatus";

export interface RuleConditionTrace {
  path: string;
  operator: string;
  expected?: unknown;
  actual?: unknown;
  matched: boolean;
  description?: string;
}

export interface RuleResult {
  id: string;
  ruleId: string;
  ruleVersion: string;
  outcome: RuleOutcome;
  category: RuleCategory;
  severity: RuleSeverity;
  message: string;
  reason: string;
  recommendation?: string;
  legalReferences: readonly LegalReference[];
  traces: readonly RuleConditionTrace[];
  evaluatedAt: string;
  durationMs: number;
  error?: string;
}
