import type { RuleConditionTrace } from "../entities/RuleResult";
import type { RuleTrace } from "../models/RuleTrace";

export class TraceBuilder {
  build(evaluationPath: readonly RuleConditionTrace[], executionTimeMs: number, evaluator = "RuleEvaluatorFactory"): RuleTrace {
    return {
      evaluator,
      evaluationPath,
      evaluatedConditions: evaluationPath.length,
      passedConditions: evaluationPath.filter((item) => item.matched).length,
      failedConditions: evaluationPath.filter((item) => !item.matched).length,
      executionTimeMs: Math.max(0, executionTimeMs),
    };
  }
}
