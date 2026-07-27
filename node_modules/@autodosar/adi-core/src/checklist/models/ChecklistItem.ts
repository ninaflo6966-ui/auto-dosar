export type ChecklistCategory =
  | "identity"
  | "vehicle"
  | "documents"
  | "validation"
  | "workflow";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  mandatory: boolean;
  blocking: boolean;
  category: ChecklistCategory;
  recommendation?: string;
}