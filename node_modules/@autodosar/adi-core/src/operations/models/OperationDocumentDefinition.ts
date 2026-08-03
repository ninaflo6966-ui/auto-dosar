import type { VisibilityCondition } from "./QuestionDefinition";

export type DocumentRequirementLevel = "required" | "conditional" | "recommended";

export interface OperationDocumentDefinition {
  id: string;
  title: string;
  description?: string;
  requirement: DocumentRequirementLevel;
  issuer?: string;
  acceptedFormats?: string[];
  maxSizeMb?: number;
  visibleWhen?: VisibilityCondition | VisibilityCondition[];
  validationRuleIds?: string[];
}
