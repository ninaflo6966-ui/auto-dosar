import type { RuleResult } from "../entities/RuleResult";
import type { IRuleRepository, RuleQuery } from "../interfaces/IRuleRepository";
import type { RuleContext } from "./RuleContext";
import type { RuleEvaluationReport, RuleExecutionSummary } from "./RuleExecutionSummary";
import { RuleExecutor } from "./RuleExecutor";

export class RuleEngine {
  constructor(private readonly repository: IRuleRepository, private readonly executor = new RuleExecutor()) {}

  async evaluate(context: RuleContext, query: RuleQuery = {}): Promise<RuleEvaluationReport> {
    const startedAt = performance.now();
    const rules = await this.repository.findAll({ ...query, activeAt: query.activeAt ?? context.asOf });
    const results = rules.map((rule) => this.executor.execute(rule, context));
    const summary = this.summarize(results, rules.length, performance.now() - startedAt);
    return {
      correlationId: context.correlationId,
      twinId: context.twin.id,
      twinVersion: context.twin.version,
      evaluatedAt: new Date().toISOString(),
      results,
      summary,
      recommendations: [...new Set(results.filter((r) => r.outcome === "FAILED" && r.recommendation).map((r) => r.recommendation as string))],
      nextActions: results.filter((r) => r.outcome === "FAILED").map((r) => r.recommendation ?? r.message),
    };
  }

  private summarize(results: readonly RuleResult[], totalRules: number, durationMs: number): RuleExecutionSummary {
    const count = (outcome: RuleResult["outcome"]) => results.filter((result) => result.outcome === outcome).length;
    const evaluatedRules = results.length;
    const passedRules = count("PASSED");
    const failedRules = count("FAILED");
    const errorRules = count("ERROR");
    const skippedRules = count("SKIPPED");
    const confidenceScore = evaluatedRules === 0 ? 100 : Math.max(0, Math.round(((passedRules + skippedRules * 0.5) / evaluatedRules) * 100));
    return {
      totalRules,
      evaluatedRules,
      passedRules,
      failedRules,
      skippedRules,
      errorRules,
      warnings: results.filter((r) => r.outcome === "FAILED" && r.severity === "WARNING").length,
      criticalFailures: results.filter((r) => r.outcome === "FAILED" && r.severity === "CRITICAL").length,
      confidenceScore,
      durationMs: Math.max(0, durationMs),
    };
  }
}
