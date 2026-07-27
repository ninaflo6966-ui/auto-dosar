import type { Rule } from "../entities/Rule";
import type { RuleResult } from "../entities/RuleResult";
import { RuleEvaluatorFactory } from "../evaluators/RuleEvaluatorFactory";
import type { RuleContext } from "./RuleContext";

export class RuleExecutor {
  constructor(private readonly evaluatorFactory = new RuleEvaluatorFactory()) {}

  execute(rule: Rule, context: RuleContext): RuleResult {
    const startedAt = performance.now();
    const evaluatedAt = new Date().toISOString();
    try {
      const traces = rule.conditions.map((condition) => this.evaluatorFactory.get(condition).evaluate(condition, context));
      const passed = traces.every((trace) => trace.matched);
      return {
        id: `${context.correlationId}:${rule.id}:${rule.version}`,
        ruleId: rule.id,
        ruleVersion: rule.version,
        outcome: passed ? "PASSED" : "FAILED",
        category: rule.category,
        severity: rule.severity,
        message: rule.message,
        reason: rule.reason,
        recommendation: rule.recommendation,
        legalReferences: rule.legalReferences ?? [],
        traces,
        evaluatedAt,
        durationMs: Math.max(0, performance.now() - startedAt),
      };
    } catch (error) {
      return {
        id: `${context.correlationId}:${rule.id}:${rule.version}`,
        ruleId: rule.id,
        ruleVersion: rule.version,
        outcome: "ERROR",
        category: rule.category,
        severity: rule.severity,
        message: rule.message,
        reason: rule.reason,
        recommendation: rule.recommendation,
        legalReferences: rule.legalReferences ?? [],
        traces: [],
        evaluatedAt,
        durationMs: Math.max(0, performance.now() - startedAt),
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
