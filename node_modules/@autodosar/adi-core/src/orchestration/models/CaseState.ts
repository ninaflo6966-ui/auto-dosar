import { ChecklistItem } from "../../checklist/models/ChecklistItem";

export interface CaseState {
  progress: number;
  currentStep: string;
  nextStep: string;
  score: number;
  readyForSubmission: boolean;
  checklist: ChecklistItem[];
}