import type { RuleResult } from "../entities/RuleResult";
import type { Recommendation } from "../models/Recommendation";
import type { NextAction } from "../models/NextAction";

export interface RuleExecutionSummary {
  totalRules: number;
  evaluatedRules: number;
  passedRules: number;
  failedRules: number;
  skippedRules: number;
  errorRules: number;
  warnings: number;
  criticalFailures: number;
  blockingActions: number;
  completenessScore: number;
  confidenceScore: number;
  durationMs: number;
}

export interface RuleEvaluationReport {
  correlationId: string;
  twinId: string;
  twinVersion: number;
  evaluatedAt: string;
  results: readonly RuleResult[];
  summary: RuleExecutionSummary;
  recommendations: readonly string[];
  nextActions: readonly string[];
  detailedRecommendations: readonly Recommendation[];
  actionPlan: readonly NextAction[];
}
