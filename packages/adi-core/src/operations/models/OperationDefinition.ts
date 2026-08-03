import type { OperationType } from "../../enums/OperationType";
import type { OperationDocumentDefinition } from "./OperationDocumentDefinition";
import type { QuestionDefinition } from "./QuestionDefinition";

export type OperationCategory = "registration" | "ownership" | "certificate" | "deregistration";

export interface OperationDefinition {
  id: string;
  type: OperationType;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: OperationCategory;
  icon: string;
  version: string;
  active: boolean;
  estimatedMinutes?: number;
  questions: QuestionDefinition[];
  documents: OperationDocumentDefinition[];
  rulePackId?: string;
  workflowId?: string;
  metadata?: Record<string, string | number | boolean>;
}
