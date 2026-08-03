import type { SmartChecklistItem } from "./SmartChecklistItem";

export type SmartChecklistHealth =
  | "READY"
  | "IN_PROGRESS"
  | "NEEDS_ATTENTION";

export interface SmartChecklistResult {
  operationId: string;
  operationSlug: string;
  operationTitle: string;
  generatedAt: string;
  items: SmartChecklistItem[];
  requiredCount: number;
  optionalCount: number;
  completedRequiredCount: number;
  missingRequiredCount: number;
  score: number;
  health: SmartChecklistHealth;
  readyForUpload: boolean;
  readyForSubmission: boolean;
  warnings: string[];
  recommendations: string[];
  nextAction?: string;
}
