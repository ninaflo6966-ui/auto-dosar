import type { LegalReference } from "../../knowledge";
import type { RuleCategory } from "./RuleCategory";
import type { RuleSeverity } from "./RuleSeverity";
import type { RuleOutcome } from "./RuleStatus";
import type { Explanation } from "../models/Explanation";
import type { Recommendation } from "../models/Recommendation";
import type { NextAction } from "../models/NextAction";
import type { RuleTrace } from "../models/RuleTrace";

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
  explanation: Explanation;
  recommendations: readonly Recommendation[];
  nextActions: readonly NextAction[];
  trace: RuleTrace;
  traces: readonly RuleConditionTrace[];
  evaluatedAt: string;
  durationMs: number;
  error?: string;
}
