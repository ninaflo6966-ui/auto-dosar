import type { RuleCondition } from "../entities/RuleCondition";
import type { IRuleEvaluator } from "../interfaces/IRuleEvaluator";
import { DefaultRuleEvaluator } from "./DefaultRuleEvaluator";

export class RuleEvaluatorFactory {
  private readonly evaluators: IRuleEvaluator[];

  constructor(evaluators: readonly IRuleEvaluator[] = [new DefaultRuleEvaluator()]) {
    this.evaluators = [...evaluators];
  }

  get(condition: RuleCondition): IRuleEvaluator {
    const evaluator = this.evaluators.find((candidate) => candidate.supports(condition));
    if (!evaluator) throw new Error(`No evaluator registered for operator ${condition.operator}`);
    return evaluator;
  }
}
