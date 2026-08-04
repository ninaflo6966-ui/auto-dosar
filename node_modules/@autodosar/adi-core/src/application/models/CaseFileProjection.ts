import type { CaseStatus } from "../../enums/CaseStatus";
import type { OperationType } from "../../enums/OperationType";
import type { OperationAnswers } from "../../operations/models/QuestionDefinition";
import type { SmartChecklistResult } from "../../checklist/models/SmartChecklistResult";
import type { CaseProgress } from "../../case-file/models/CaseProgress";
import type { DocumentType } from "../../documents/enums/DocumentType";
import type { DocumentStatus } from "../../documents/enums/DocumentStatus";

export interface CaseFileProjectionDocument {
  id: string;
  checklistDocumentId?: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  storageKey?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CaseFileProjection {
  caseId: string;
  reference: string;
  operation: OperationType;
  operationSlug?: string;
  status: CaseStatus;
  score: number;
  version: number;
  answers?: OperationAnswers;
  checklist?: SmartChecklistResult;
  progress?: CaseProgress;
  documents?: CaseFileProjectionDocument[];
  createdAt: Date;
  updatedAt: Date;
}
