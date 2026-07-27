import type { RuleResult } from "../entities/RuleResult";
import type { IRuleRepository, RuleQuery } from "../interfaces/IRuleRepository";
import type { Recommendation } from "../models/Recommendation";
import type { NextAction } from "../models/NextAction";
import type { RuleContext } from "./RuleContext";
import type { RuleEvaluationReport, RuleExecutionSummary } from "./RuleExecutionSummary";
import { RuleExecutor } from "./RuleExecutor";

export class RuleEngine {
  constructor(private readonly repository: IRuleRepository, private readonly executor = new RuleExecutor()) {}

  async evaluate(context: RuleContext, query: RuleQuery = {}): Promise<RuleEvaluationReport> {
    const startedAt = performance.now();
    const rules = await this.repository.findAll({ ...query, activeAt: query.activeAt ?? context.asOf });
    const results = rules.map((rule) => this.executor.execute(rule, context));
    const detailedRecommendations = this.aggregateRecommendations(results);
    const actionPlan = this.aggregateActions(results);
    const summary = this.summarize(results, rules.length, performance.now() - startedAt, actionPlan);
    return {
      correlationId: context.correlationId,
      twinId: context.twin.id,
      twinVersion: context.twin.version,
      evaluatedAt: new Date().toISOString(),
      results,
      summary,
      recommendations: detailedRecommendations.map((item) => item.action),
      nextActions: actionPlan.map((item) => item.label),
      detailedRecommendations,
      actionPlan,
    };
  }

  private aggregateRecommendations(results: readonly RuleResult[]): Recommendation[] {
    const byId = new Map<string, Recommendation>();
    for (const recommendation of results.flatMap((result) => result.recommendations)) {
      if (!byId.has(recommendation.id)) byId.set(recommendation.id, recommendation);
    }
    const rank = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 } as const;
    return [...byId.values()].sort((a, b) => rank[b.priority] - rank[a.priority]);
  }

  private aggregateActions(results: readonly RuleResult[]): NextAction[] {
    const byCode = new Map<string, NextAction>();
    for (const action of results.flatMap((result) => result.nextActions)) {
      const current = byCode.get(action.code);
      if (!current || (!current.blocking && action.blocking)) byCode.set(action.code, action);
    }
    return [...byCode.values()].sort((a, b) => Number(b.blocking) - Number(a.blocking) || a.order - b.order);
  }

  private summarize(results: readonly RuleResult[], totalRules: number, durationMs: number, actions: readonly NextAction[]): RuleExecutionSummary {
    const count = (outcome: RuleResult["outcome"]) => results.filter((result) => result.outcome === outcome).length;
    const evaluatedRules = results.length;
    const passedRules = count("PASSED");
    const failedRules = count("FAILED");
    const errorRules = count("ERROR");
    const skippedRules = count("SKIPPED");
    const confidenceScore = evaluatedRules === 0 ? 100 : Math.max(0, Math.round((results.reduce((sum, result) => sum + result.explanation.confidence, 0) / evaluatedRules) * 100));
    const completenessScore = evaluatedRules === 0 ? 100 : Math.max(0, Math.round(((passedRules + skippedRules * 0.5) / evaluatedRules) * 100));
    return {
      totalRules,
      evaluatedRules,
      passedRules,
      failedRules,
      skippedRules,
      errorRules,
      warnings: results.filter((r) => r.outcome === "FAILED" && r.severity === "WARNING").length,
      criticalFailures: results.filter((r) => r.outcome === "FAILED" && r.severity === "CRITICAL").length,
      blockingActions: actions.filter((action) => action.blocking).length,
      completenessScore,
      confidenceScore,
      durationMs: Math.max(0, durationMs),
    };
  }
}
