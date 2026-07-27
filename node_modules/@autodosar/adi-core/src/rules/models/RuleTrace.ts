import type { RuleConditionTrace } from "../entities/RuleResult";

export interface RuleTrace {
  evaluator: string;
  evaluationPath: readonly RuleConditionTrace[];
  evaluatedConditions: number;
  passedConditions: number;
  failedConditions: number;
  executionTimeMs: number;
}
