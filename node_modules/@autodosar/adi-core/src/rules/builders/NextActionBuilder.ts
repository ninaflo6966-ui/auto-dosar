import type { Rule } from "../entities/Rule";
import type { RuleOutcome } from "../entities/RuleStatus";
import type { NextAction, NextActionDefinition } from "../models/NextAction";

export class NextActionBuilder {
  build(rule: Rule, outcome: RuleOutcome): NextAction[] {
    const definitions: NextActionDefinition[] = rule.nextActions
      ? [...rule.nextActions]
      : outcome === "FAILED" && rule.recommendation
        ? [{ code: `${rule.id}.RESOLVE`, label: rule.recommendation, blocking: rule.severity === "ERROR" || rule.severity === "CRITICAL" }]
        : [];

    return definitions
      .filter((item) => item.appliesOn === "ALWAYS" || item.appliesOn === outcome || (!item.appliesOn && outcome === "FAILED"))
      .map((item, index) => ({
        code: item.code,
        ruleId: rule.id,
        label: item.label,
        order: item.order ?? index + 1,
        blocking: item.blocking ?? false,
        description: item.description,
      }))
      .sort((a, b) => a.order - b.order);
  }
}
