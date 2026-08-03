import type { DocumentRequirementLevel } from "../../operations/models/OperationDocumentDefinition";

export type SmartChecklistStatus =
  | "required"
  | "optional"
  | "missing"
  | "uploaded"
  | "validated";

export interface SmartChecklistItem {
  id: string;
  title: string;
  description?: string;
  requirement: DocumentRequirementLevel;
  mandatory: boolean;
  blocking: boolean;
  status: SmartChecklistStatus;
  reason: string;
  recommendation: string;
  issuer?: string;
  acceptedFormats?: string[];
  validationRuleIds?: string[];
}
