import type { Rule } from "../entities/Rule";
import type { RuleOutcome } from "../entities/RuleStatus";
import type { Explanation } from "../models/Explanation";

export class ExplanationBuilder {
  build(rule: Rule, outcome: RuleOutcome, generatedAt: string, confidence: number): Explanation {
    const template = rule.explanation;
    const description = outcome === "PASSED"
      ? template?.passedDescription ?? template?.description ?? rule.description
      : template?.failedDescription ?? template?.description ?? rule.message;

    return {
      title: template?.title ?? rule.name,
      description,
      reason: template?.reason ?? rule.reason,
      severity: rule.severity,
      confidence: Math.max(0, Math.min(1, confidence)),
      generatedAt,
    };
  }
}
