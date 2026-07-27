import { ChecklistItem } from "./ChecklistItem";

export type CaseHealth = "EXCELLENT" | "GOOD" | "NEEDS_ATTENTION" | "CRITICAL";

export interface ChecklistResult {
  items: ChecklistItem[];
  progress: number;
  score: number;
  health: CaseHealth;
  readyForSubmission: boolean;
  nextAction?: string;
}