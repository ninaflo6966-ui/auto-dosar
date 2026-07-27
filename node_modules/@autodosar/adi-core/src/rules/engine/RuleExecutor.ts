import type { Rule } from "../entities/Rule";
import type { RuleResult } from "../entities/RuleResult";
import { ExplanationBuilder } from "../builders/ExplanationBuilder";
import { RecommendationBuilder } from "../builders/RecommendationBuilder";
import { NextActionBuilder } from "../builders/NextActionBuilder";
import { TraceBuilder } from "../builders/TraceBuilder";
import { RuleEvaluatorFactory } from "../evaluators/RuleEvaluatorFactory";
import type { RuleContext } from "./RuleContext";

export class RuleExecutor {
  constructor(
    private readonly evaluatorFactory = new RuleEvaluatorFactory(),
    private readonly explanationBuilder = new ExplanationBuilder(),
    private readonly recommendationBuilder = new RecommendationBuilder(),
    private readonly nextActionBuilder = new NextActionBuilder(),
    private readonly traceBuilder = new TraceBuilder(),
  ) {}

  execute(rule: Rule, context: RuleContext): RuleResult {
    const startedAt = performance.now();
    const evaluatedAt = new Date().toISOString();
    try {
      const traces = rule.conditions.map((condition) => this.evaluatorFactory.get(condition).evaluate(condition, context));
      const passed = traces.every((trace) => trace.matched);
      const outcome = passed ? "PASSED" : "FAILED";
      const durationMs = Math.max(0, performance.now() - startedAt);
      const confidence = traces.length === 0 ? 1 : traces.filter((trace) => trace.matched).length / traces.length;
      return {
        id: `${context.correlationId}:${rule.id}:${rule.version}`,
        ruleId: rule.id,
        ruleVersion: rule.version,
        outcome,
        category: rule.category,
        severity: rule.severity,
        message: rule.message,
        reason: rule.reason,
        recommendation: rule.recommendation,
        legalReferences: rule.legalReferences ?? [],
        explanation: this.explanationBuilder.build(rule, outcome, evaluatedAt, confidence),
        recommendations: this.recommendationBuilder.build(rule, outcome),
        nextActions: this.nextActionBuilder.build(rule, outcome),
        trace: this.traceBuilder.build(traces, durationMs),
        traces,
        evaluatedAt,
        durationMs,
      };
    } catch (error) {
      const outcome = "ERROR" as const;
      const durationMs = Math.max(0, performance.now() - startedAt);
      return {
        id: `${context.correlationId}:${rule.id}:${rule.version}`,
        ruleId: rule.id,
        ruleVersion: rule.version,
        outcome,
        category: rule.category,
        severity: rule.severity,
        message: rule.message,
        reason: rule.reason,
        recommendation: rule.recommendation,
        legalReferences: rule.legalReferences ?? [],
        explanation: this.explanationBuilder.build(rule, outcome, evaluatedAt, 0),
        recommendations: [],
        nextActions: [],
        trace: this.traceBuilder.build([], durationMs),
        traces: [],
        evaluatedAt,
        durationMs,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
