import { OperationType } from "../../enums/OperationType";
import { PersonType } from "../../enums/PersonType";

export type OwnershipDocumentMode = "EXISTING" | "GENERATE";

export type GeneratedDocumentDestination =
  | "LOCAL_TAX"
  | "DGPCI"
  | "BOTH";

export type GeneratedDocumentStatus =
  | "READY"
  | "WAITING_FOR_DATA"
  | "NOT_APPLICABLE";

export interface DocumentGenerationContext {
  operation: OperationType;
  sellerType: PersonType;
  ownershipMode: OwnershipDocumentMode;
  availableDocumentTypes: string[];
  caseReference?: string;
}

export interface GeneratedDocumentPlan {
  id: string;
  title: string;
  description: string;
  destination: GeneratedDocumentDestination;
  status: GeneratedDocumentStatus;
  generatorId: string;
  requiredData: string[];
  previewAvailable: boolean;
  downloadableFiles: string[];
}

export interface DocumentGeneratorOutput {
  documents: GeneratedDocumentPlan[];
  warnings?: string[];
  errors?: string[];
  nextActions?: string[];
}

export interface DocumentGenerator {
  readonly id: string;
  supports(context: DocumentGenerationContext): boolean;
  generate(context: DocumentGenerationContext): DocumentGeneratorOutput;
}

export interface DocumentGenerationResult {
  caseReference: string;
  operation: OperationType;
  generatedDocuments: GeneratedDocumentPlan[];
  warnings: string[];
  errors: string[];
  nextActions: string[];
  downloadableFiles: string[];
  generatedAt: string;
}
