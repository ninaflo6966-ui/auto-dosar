export type RecommendationPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RecommendationDefinition {
  id?: string;
  priority?: RecommendationPriority;
  action: string;
  description?: string;
  estimatedImpact?: string;
  appliesOn?: "FAILED" | "PASSED" | "ALWAYS";
}

export interface Recommendation {
  id: string;
  ruleId: string;
  priority: RecommendationPriority;
  action: string;
  description?: string;
  estimatedImpact?: string;
}
