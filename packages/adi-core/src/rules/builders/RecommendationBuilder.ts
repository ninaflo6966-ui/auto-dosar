import type { Rule } from "../entities/Rule";
import type { RuleOutcome } from "../entities/RuleStatus";
import type { Recommendation, RecommendationDefinition, RecommendationPriority } from "../models/Recommendation";

const severityPriority: Record<Rule["severity"], RecommendationPriority> = {
  INFO: "LOW",
  WARNING: "MEDIUM",
  ERROR: "HIGH",
  CRITICAL: "CRITICAL",
};

export class RecommendationBuilder {
  build(rule: Rule, outcome: RuleOutcome): Recommendation[] {
    const definitions: RecommendationDefinition[] = rule.recommendations
      ? [...rule.recommendations]
      : rule.recommendation
        ? [{ action: rule.recommendation, appliesOn: "FAILED" }]
        : [];

    return definitions
      .filter((item) => item.appliesOn === "ALWAYS" || item.appliesOn === outcome || (!item.appliesOn && outcome === "FAILED"))
      .map((item, index) => ({
        id: item.id ?? `${rule.id}:recommendation:${index + 1}`,
        ruleId: rule.id,
        priority: item.priority ?? severityPriority[rule.severity],
        action: item.action,
        description: item.description,
        estimatedImpact: item.estimatedImpact,
      }));
  }
}
