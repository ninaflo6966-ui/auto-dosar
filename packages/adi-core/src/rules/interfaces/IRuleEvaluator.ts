import type { RuleCondition } from "../entities/RuleCondition";
import type { RuleConditionTrace } from "../entities/RuleResult";
import type { RuleContext } from "../engine/RuleContext";

export interface IRuleEvaluator {
  supports(condition: RuleCondition): boolean;
  evaluate(condition: RuleCondition, context: RuleContext): RuleConditionTrace;
}
